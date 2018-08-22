/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import Crypto from './services/crypto';
import Store from './services/store';
import System from './services/system';
import execCmd from './utils/execCmd';
import getPrivateKeyPhase from './phases/get_private_key_phase';
import checkDockerAvailablePhase from './phases/check_docker_available_phase';
import askForPrivateKeyDialog from './dialogs/ask_for_private_key_dialog';
import dockerDetectedDialog from './dialogs/docker_detected_dialog';
import dockerMissingDialog from './dialogs/docker_missing_dialog';

import Web3 from 'web3';

class Builder {
  async build(config) {
    const objects = {};
    objects.config = config;
    objects.web3 = new Web3();
    objects.store = new Store(config.storePath);
    objects.crypto = new Crypto(objects.web3);
    objects.system = new System(execCmd);

    objects.askForPrivateKeyDialog = askForPrivateKeyDialog(objects.crypto);
    objects.getPrivateKeyPhase = getPrivateKeyPhase(objects.store, objects.crypto, objects.askForPrivateKeyDialog);
    objects.dockerDetectedDialog = dockerDetectedDialog();
    objects.dockerMissingDialog = dockerMissingDialog();
    objects.checkDockerAvailablePhase = checkDockerAvailablePhase(objects.system, objects.dockerDetectedDialog, objects.dockerMissingDialog);

    this.objects = objects;
    return objects;
  }
}

export default Builder;
