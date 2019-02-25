/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/


const getNodeIP = async (stateModel, askForNodeIPDialog) => {
  const storedNodeIP = await stateModel.getNodeIP();
  if (storedNodeIP !== null) {
    return storedNodeIP;
  }

  const answers = await askForNodeIPDialog();
  const {nodeIP : providedIP} = answers;
  stateModel.storeNodeIP(providedIP);
  return providedIP;
};

const getNodeIPPhase = (stateModel, nodeIPDetectedDialog, askForNodeIPDialog) => async () => {
  const nodeIP = await getNodeIP(stateModel, askForNodeIPDialog);
  await nodeIPDetectedDialog(nodeIP);
  return nodeIP;
};

export default getNodeIPPhase;
