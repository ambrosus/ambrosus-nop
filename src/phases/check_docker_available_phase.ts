/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/
import Dialog from '../models/dialog_model';
import System from '../services/system';

const checkDockerAvailablePhase = async () => {
  if (!await System.isDockerAvailable()) {
    Dialog.dockerMissingDialog();
    return false;
  }
  Dialog.dockerDetectedDialog();
  return true;
};

export default checkDockerAvailablePhase;
