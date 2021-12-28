/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/
import Dialog from '../models/dialog_model';
import StateModel from '../models/state_model';

const getNodeIP = async () => {
  const storedNodeIP = await StateModel.getNodeIP();
  if (storedNodeIP !== null) {
    return storedNodeIP;
  }

  const answers = await Dialog.askForNodeIPDialog();
  const {nodeIP : providedIP} = answers;
  await StateModel.storeNodeIP(providedIP);
  return providedIP;
};

const getNodeIPPhase = async () => {
  const nodeIP = await getNodeIP();
  await Dialog.nodeIPDetectedDialog(nodeIP);
  return nodeIP;
};

export default getNodeIPPhase;
