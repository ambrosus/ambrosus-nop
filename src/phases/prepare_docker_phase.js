/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/


import {ATLAS_1, ATLAS_2, ATLAS_3, HERMES} from '../consts';

const prepareDockerPhase = (stateModel, healthCheckUrlDialog, dockerComposeCommandDialog) => async () => {
  await stateModel.prepareSetupFiles();

  dockerComposeCommandDialog();

  const role = await stateModel.getRole();
  if (role === HERMES || role === ATLAS_1 || role === ATLAS_2 || role === ATLAS_3) {
    const url = await stateModel.getNodeUrl();
    if (url) {
      healthCheckUrlDialog(`${url}/health`);
    }
  }
};

export default prepareDockerPhase;
