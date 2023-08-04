/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/
import Dialog from '../dialogs/dialog_model';
import {getMyIP} from '../utils/http_utils';

const getNodeIPPhase = async (storedNodeIP) => {
  const nodeIP = await getNodeIP(storedNodeIP);
  await Dialog.nodeIPDetectedDialog(nodeIP);
  return nodeIP;
};


const getNodeIP = async (storedNodeIP) => {
  if (storedNodeIP !== null) {
    return storedNodeIP;
  }

  const ipGuess = await getMyIP();
  const answers = await Dialog.askForNodeIPDialog(ipGuess);
  if (answers.useGuess) {
    return ipGuess;
  }
  return answers.nodeIP;
};


export default getNodeIPPhase;
