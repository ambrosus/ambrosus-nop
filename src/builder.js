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

import {HeadWrapper, KycWhitelistWrapper, RolesWrapper} from 'ambrosus-contracts';

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

import execCmd from './utils/execCmd';
import messages from './messages';

import Web3 from 'web3';

class Builder {
  async build(config) {
    const objects = {};
    objects.config = config;
    objects.web3 = new Web3(config.web3Rpc);

    objects.headWrapper = new HeadWrapper(config.headContractAddress, objects.web3);
    objects.kycWhitelistWrapper = new KycWhitelistWrapper(objects.headWrapper, objects.web3);
    objects.rolesWrapper = new RolesWrapper(objects.headWrapper, objects.web3);

    objects.store = new Store(config.storePath);
    objects.crypto = new Crypto(objects.web3);
    objects.system = new System(execCmd);
    objects.validations = new Validations();

    objects.stateModel = new StateModel(objects.store, objects.crypto);
    objects.systemModel = new SystemModel(objects.system);
    objects.smartContractsModel = new SmartContractsModel(objects.kycWhitelistWrapper, objects.rolesWrapper);

    objects.privateKeyDetectedDialog = privateKeyDetectedDialog(objects.crypto, messages);
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

    objects.checkDockerAvailablePhase = checkDockerAvailablePhase(objects.systemModel, objects.dockerDetectedDialog, objects.dockerMissingDialog);
    objects.getPrivateKeyPhase = getPrivateKeyPhase(objects.stateModel, objects.privateKeyDetectedDialog, objects.askForPrivateKeyDialog);
    objects.checkAddressWhitelistingStatusPhase = checkAddressWhitelistingStatusPhase(objects.smartContractsModel, objects.stateModel, objects.addressIsNotWhitelistedDialog, objects.addressIsWhitelistedDialog);
    objects.selectNodeTypePhase = selectNodeTypePhase(objects.stateModel, objects.askForNodeTypeDialog, objects.roleSelectedDialog);
    objects.getNodeUrlPhase = getNodeUrlPhase(objects.stateModel, objects.nodeUrlDetectedDialog, objects.askForNodeUrlDialog);
    objects.getUserEmailPhase = getUserEmailPhase(objects.stateModel, objects.userEmailDetectedDialog, objects.askForUserEmailDialog);
    objects.manualSubmissionPhase = manualSubmissionPhase(objects.stateModel, objects.displaySubmissionDialog);

    this.objects = objects;
    return objects;
  }

  async augmentBuildWithPrivateKey(objects, privateKey) {
    const account = objects.web3.eth.accounts.privateKeyToAccount(privateKey);
    objects.web3.eth.accounts.wallet.add(account);

    const {address} = account;
    objects.web3.eth.defaultAccount = address;

    objects.headWrapper.setDefaultAddress(address);
    objects.kycWhitelistWrapper.setDefaultAddress(address);
    objects.rolesWrapper.setDefaultAddress(address);
  }
}

export default Builder;
