/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import Dialog from '../dialogs/dialog_model';
import Crypto from '../utils/crypto';


const getPrivateKeyPhase = async (storedPrivateKey) => {
  const privateKey = await getPrivateKey(storedPrivateKey);

  const address = Crypto.addressForPrivateKey(privateKey);
  Dialog.privateKeyDetectedDialog(address);

  return privateKey;
};


const getPrivateKey = async (storedPrivateKey) => {
  if (storedPrivateKey !== null) {
    return storedPrivateKey;
  }

  const answers = await Dialog.askForPrivateKeyDialog();

  if (answers.source === 'manual') {
    return answers.privateKey;
  }
  if (answers.source === 'generate') {
    return Crypto.generatePrivateKey();
  }
  throw new Error('Unexpected source');
};

export default getPrivateKeyPhase;
