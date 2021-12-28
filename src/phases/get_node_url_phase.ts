/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/
import Dialog from '../models/dialog_model';
import StateModel from '../models/state_model';

const getNodeUrl = async () => {
  const storedNodeUrl = await StateModel.getNodeUrl();
  if (storedNodeUrl !== null) {
    return storedNodeUrl;
  }

  const answers = await Dialog.askForNodeUrlDialog();
  const {nodeUrl} = answers;
  await StateModel.storeNodeUrl(nodeUrl);
  return nodeUrl;
};

const getNodeUrlPhase = async () => {
  const nodeUrl = await getNodeUrl();
  await Dialog.nodeUrlDetectedDialog(nodeUrl);
  return nodeUrl;
};

export default getNodeUrlPhase;
