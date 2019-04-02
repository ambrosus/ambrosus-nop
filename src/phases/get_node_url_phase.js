/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

const getNodeUrl = async (stateModel, askForNodeUrlDialog) => {
  const storedNodeUrl = await stateModel.getNodeUrl();
  if (storedNodeUrl !== null) {
    return storedNodeUrl;
  }

  const answers = await askForNodeUrlDialog();
  const {nodeUrl} = answers;
  await stateModel.storeNodeUrl(nodeUrl);
  return nodeUrl;
};

const getNodeUrlPhase = (stateModel, nodeUrlDetectedDialog, askForNodeUrlDialog) => async () => {
  const nodeUrl = await getNodeUrl(stateModel, askForNodeUrlDialog);
  await nodeUrlDetectedDialog(nodeUrl);
  return nodeUrl;
};

export default getNodeUrlPhase;
