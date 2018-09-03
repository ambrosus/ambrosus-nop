/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/


import {APOLLO} from '../consts';

const getNodeUrl = async (stateModel, askForNodeUrlDialog) => {
  const existingNodeUrl = await stateModel.getExistingNodeUrl();
  if (existingNodeUrl !== null) {
    return existingNodeUrl;
  }

  const answers = await askForNodeUrlDialog();
  const {nodeUrl} = answers;
  await stateModel.storeNodeUrl(nodeUrl);
  return nodeUrl;
};

const getNodeUrlPhase = (stateModel, nodeUrlDetectedDialog, askForNodeUrlDialog) => async () => {
  const role = await stateModel.getExistingRole();
  if (role === null) {
    throw new Error('Role should have been selected at this stage');
  }
  if (role === APOLLO) {
    return null;
  }
  const nodeUrl = await getNodeUrl(stateModel, askForNodeUrlDialog);
  await nodeUrlDetectedDialog(nodeUrl);
  return nodeUrl;
};

export default getNodeUrlPhase;
