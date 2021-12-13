/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import StateModel from './models/state_model';
import SmartContractsModel from './models/smart_contracts_model';
import Dialog from './models/dialog_model';
import selectNetworkPhase from './phases/select_network_phase';
import {selectActionPhase, defaultActions} from './phases/select_action_phase';
import * as networks from '../config/networks.json';
import checkDockerAvailablePhase from './phases/check_docker_available_phase';
import getPrivateKeyPhase from './phases/get_private_key_phase';
import Crypto from './services/crypto';
import checkAddressWhitelistingStatusPhase from './phases/check_address_whitelisting_status_phase';
import selectNodeTypePhase from './phases/select_node_type_phase';
import {APOLLO} from './consts';
import getNodeIPPhase from './phases/get_node_ip_phase';
import getNodeUrlPhase from './phases/get_node_url_phase';
import getUserEmailPhase from './phases/get_user_email_phase';
import acceptTosPhase from './phases/accept_tos_phase';
import manualSubmissionPhase from './phases/manual_submission_phase';
import performOnboardingPhase from './phases/perform_onboarding_phase';
import prepareDockerPhase from './phases/prepare_docker_phase';

const start = async () => {
  Dialog.logoDialog();

  if (!await checkDockerAvailablePhase()) {
    return;
  }
  const network = await selectNetworkPhase(networks);
  const privateKey = await getPrivateKeyPhase();

  await StateModel.checkStateVariables(); // MOVED HERE

  Crypto.setWeb3UsingRpc(network.rpc); // MOVED HERE
  Crypto.setAccount(privateKey); // MOVED HERE

  SmartContractsModel.init(network); // NEW

  const whitelistingStatus = await checkAddressWhitelistingStatusPhase();

  const role = await selectNodeTypePhase();
  if (role === APOLLO) {
    await getNodeIPPhase();
  } else {
    await getNodeUrlPhase();
  }
  await getUserEmailPhase();

  await acceptTosPhase();
  if (whitelistingStatus === null) {
    await manualSubmissionPhase();
    return;
  }

  const isOnboarded = await performOnboardingPhase(whitelistingStatus);
  if (!isOnboarded) {
    return;
  }

  await prepareDockerPhase();

  const isInteractive = process.argv[2] !== 'update';
  if (isInteractive) {
    await (selectActionPhase(role, defaultActions))();
  }
};

start()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
