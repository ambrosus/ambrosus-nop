/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

const getPrivateKey = async (stateModel, askForPrivateKeyDialog) => {
  const existingPrivateKey = await stateModel.getExistingPrivateKey();
  if (existingPrivateKey !== null) {
    return existingPrivateKey;
  }

  const answers = await askForPrivateKeyDialog();
  const {source} = answers;
  switch (source) {
    case 'manual': {
      const {privateKey} = answers;
      await stateModel.storePrivateKey(privateKey);
      return privateKey;
    }
    case 'generate': {
      return await stateModel.generateAndStoreNewPrivateKey();
    }
    default:
      throw new Error('Unexpected source');
  }
};

const getPrivateKeyPhase = (stateModel, privateKeyDetectedDialog, askForPrivateKeyDialog) => async () => {
  const privateKey = await getPrivateKey(stateModel, askForPrivateKeyDialog);
  await privateKeyDetectedDialog(privateKey);
  return privateKey;
};

export default getPrivateKeyPhase;

