/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

const getPrivateKey = async (stateModel, askForPrivateKeyDialog) => {
  const storedPrivateKey = await stateModel.getPrivateKey();
  if (storedPrivateKey !== null) {
    return storedPrivateKey;
  }

  const answers = await askForPrivateKeyDialog();
  const {source} = answers;
  switch (source) {
    case 'manual': {
      const {privateKey} = answers;
      await stateModel.storePrivateKey(privateKey);
      const address = await stateModel.getAddress();
      await stateModel.storeAddress(address);
      return privateKey;
    }
    case 'generate': {
      const privateKey = await stateModel.generateAndStoreNewPrivateKey();
      const address = await stateModel.getAddress();
      await stateModel.storeAddress(address);
      return privateKey;
    }
    default:
      throw new Error('Unexpected source');
  }
};

const getPrivateKeyPhase = (stateModel, crypto, privateKeyDetectedDialog, askForPrivateKeyDialog) => async () => {
  const privateKey = await getPrivateKey(stateModel, askForPrivateKeyDialog);
  const address = await crypto.addressForPrivateKey(privateKey);
  await privateKeyDetectedDialog(address);
  return privateKey;
};

export default getPrivateKeyPhase;
