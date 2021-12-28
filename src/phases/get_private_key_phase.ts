/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import Dialog from '../models/dialog_model';
import Crypto from '../services/crypto';
import StateModel from '../models/state_model';

const getPrivateKey = async () => {
  const storedPrivateKey = await StateModel.getPrivateKey();
  if (storedPrivateKey !== null) {
    return storedPrivateKey;
  }

  const answers = await Dialog.askForPrivateKeyDialog();
  const {source} = answers;
  switch (source) {
    case 'manual': {
      const {privateKey} = answers;
      await StateModel.storePrivateKey(privateKey);
      const address = await StateModel.getAddress();
      await StateModel.storeAddress(address);
      return privateKey;
    }
    case 'generate': {
      const privateKey = await StateModel.generateAndStoreNewPrivateKey();
      const address = await StateModel.getAddress();
      await StateModel.storeAddress(address);
      return privateKey;
    }
    default:
      throw new Error('Unexpected source');
  }
};

const getPrivateKeyPhase = async () => {
  const privateKey = await getPrivateKey();
  const address = await Crypto.addressForPrivateKey(privateKey);
  Dialog.privateKeyDetectedDialog(address);
  return privateKey;
};

export default getPrivateKeyPhase;
