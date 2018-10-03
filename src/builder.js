/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import Crypto from './services/crypto';
import Store from './services/store';
import System from './services/system';
import Validations from './services/validations';

import {HeadWrapper, KycWhitelistWrapper, RolesWrapper} from 'ambrosus-node-contracts';

import StateModel from './models/state_model';
import SystemModel from './models/system_model';
import SmartContractsModel from './models/smart_contracts_model';

import checkDockerAvailablePhase from './phases/check_docker_available_phase';
import getPrivateKeyPhase from './phases/get_private_key_phase';
import checkAddressWhitelistingStatusPhase from './phases/check_address_whitelisting_status_phase';
import selectNodeTypePhase from './phases/select_node_type_phase';
import getNodeUrlPhase from './phases/get_node_url_phase';
import getUserEmailPhase from './phases/get_user_email_phase';
import manualSubmissionPhase from './phases/manual_submission_phase';
import performOnboardingPhase from './phases/perform_onboarding_phase';
import selectNetworkPhase from './phases/select_network_phase';

import askForPrivateKeyDialog from './dialogs/ask_for_private_key_dialog';
import dockerDetectedDialog from './dialogs/docker_detected_dialog';
import dockerMissingDialog from './dialogs/docker_missing_dialog';
import privateKeyDetectedDialog from './dialogs/private_key_detected_dialog';
import askForNodeTypeDialog from './dialogs/ask_for_node_type_dialog';
import askForNodeUrlDialog from './dialogs/ask_for_node_url_dialog';
import roleSelectedDialog from './dialogs/role_selected_dialog';
import nodeUrlDetectedDialog from './dialogs/node_url_detected_dialog';
import askForUserEmailDialog from './dialogs/ask_for_user_email_dialog';
import userEmailDetectedDialog from './dialogs/user_email_detected_dialog';
import displaySubmissionDialog from './dialogs/display_submission_dialog';
import addressIsNotWhitelistedDialog from './dialogs/address_is_not_whitelisted_dialog';
import addressIsWhitelistedDialog from './dialogs/address_is_whitelisted_dialog';
import notEnoughBalanceDialog from './dialogs/not_enough_balance_dialog';
import onboardingConfirmationDialog from './dialogs/onboarding_confirmation_dialog';
import onboardingSuccessfulDialog from './dialogs/onboarding_successful_dialog';
import alreadyOnboardedDialog from './dialogs/already_onboarded_dialog';
import askForNetworkDialog from './dialogs/ask_for_network_dialog';
import networkSelectedDialog from './dialogs/network_selected_dialog';

import execCmd from './utils/execCmd';
import messages from './messages';
import networks from '../networks';

import Web3 from 'web3';

class Builder {
  buildStage1(storePath) {
    const objects = {};

    objects.web3 = new Web3();

    objects.store = new Store(storePath);
    objects.system = new System(execCmd);
    objects.validations = new Validations();
    objects.crypto = new Crypto(objects.web3);

    objects.systemModel = new SystemModel(objects.system);
    objects.stateModel = new StateModel(objects.store, objects.crypto);

    objects.privateKeyDetectedDialog = privateKeyDetectedDialog(messages);
    objects.askForPrivateKeyDialog = askForPrivateKeyDialog(objects.validations, messages);
    objects.dockerDetectedDialog = dockerDetectedDialog(messages);
    objects.dockerMissingDialog = dockerMissingDialog(messages);
    objects.askForNodeTypeDialog = askForNodeTypeDialog(messages);
    objects.roleSelectedDialog = roleSelectedDialog(messages);
    objects.askForNodeUrlDialog = askForNodeUrlDialog(objects.validations, messages);
    objects.nodeUrlDetectedDialog = nodeUrlDetectedDialog(messages);
    objects.askForUserEmailDialog = askForUserEmailDialog(objects.validations, messages);
    objects.userEmailDetectedDialog = userEmailDetectedDialog(messages);
    objects.displaySubmissionDialog = displaySubmissionDialog(messages);
    objects.addressIsNotWhitelistedDialog = addressIsNotWhitelistedDialog(messages);
    objects.addressIsWhitelistedDialog = addressIsWhitelistedDialog(messages);
    objects.notEnoughBalanceDialog = notEnoughBalanceDialog(messages);
    objects.onboardingConfirmationDialog = onboardingConfirmationDialog(messages);
    objects.onboardingSuccessfulDialog = onboardingSuccessfulDialog(messages);
    objects.alreadyOnboardedDialog = alreadyOnboardedDialog(messages);
    objects.askForNetworkDialog = askForNetworkDialog(messages);
    objects.networkSelectedDialog = networkSelectedDialog(messages);

    objects.selectNetworkPhase = selectNetworkPhase(networks, objects.stateModel, objects.askForNetworkDialog, objects.networkSelectedDialog);
    objects.checkDockerAvailablePhase = checkDockerAvailablePhase(objects.systemModel, objects.dockerDetectedDialog, objects.dockerMissingDialog);
    objects.getPrivateKeyPhase = getPrivateKeyPhase(objects.stateModel, objects.crypto, objects.privateKeyDetectedDialog, objects.askForPrivateKeyDialog);

    this.objects = objects;
    return objects;
  }

  buildStage2(network, privateKey) {
    const objects = {};

    objects.web3 = new Web3(network.rpc);
    const account = objects.web3.eth.accounts.privateKeyToAccount(privateKey);
    objects.web3.eth.accounts.wallet.add(account);

    const {address} = account;
    objects.web3.eth.defaultAccount = address;

    objects.headWrapper = new HeadWrapper(network.headContractAddress, objects.web3, address);
    objects.kycWhitelistWrapper = new KycWhitelistWrapper(objects.headWrapper, objects.web3, address);
    objects.rolesWrapper = new RolesWrapper(objects.headWrapper, objects.web3, address);

    objects.crypto = new Crypto(objects.web3);

    objects.stateModel = new StateModel(this.objects.store, objects.crypto);
    objects.smartContractsModel = new SmartContractsModel(objects.crypto, objects.kycWhitelistWrapper, objects.rolesWrapper);

    objects.selectNodeTypePhase = selectNodeTypePhase(objects.stateModel, this.objects.askForNodeTypeDialog, this.objects.roleSelectedDialog);
    objects.getNodeUrlPhase = getNodeUrlPhase(objects.stateModel, this.objects.nodeUrlDetectedDialog, this.objects.askForNodeUrlDialog);
    objects.getUserEmailPhase = getUserEmailPhase(objects.stateModel, this.objects.userEmailDetectedDialog, this.objects.askForUserEmailDialog);
    objects.manualSubmissionPhase = manualSubmissionPhase(objects.stateModel, this.objects.displaySubmissionDialog);
    objects.checkAddressWhitelistingStatusPhase = checkAddressWhitelistingStatusPhase(objects.smartContractsModel, objects.stateModel, this.objects.addressIsNotWhitelistedDialog, this.objects.addressIsWhitelistedDialog);
    objects.performOnboardingPhase = performOnboardingPhase(objects.stateModel, objects.smartContractsModel,
      this.objects.notEnoughBalanceDialog, this.objects.alreadyOnboardedDialog, this.objects.onboardingConfirmationDialog,
      this.objects.onboardingSuccessfulDialog);

    this.objects = {...this.objects, ...objects};
    return this.objects;
  }
}

export default Builder;
