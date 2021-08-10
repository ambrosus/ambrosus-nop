/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

const getPrivateKey = async (stateModel, askForPrivateKeyDialog, askForPassphraseDialog, askForPassphraseUnlockDialog) => {
  const storedEncryptedWallet = await stateModel.getEncryptedWallet();
  if (storedEncryptedWallet !== null) {
    const {passphraseUnlock} = await askForPassphraseUnlockDialog();
    await stateModel.decryptWallet(passphraseUnlock);
    return;
  }

  const answers = await askForPrivateKeyDialog();
  const {source} = answers;

  const passphraseAnswers = await askForPassphraseDialog();
  const {passphraseType, passphrase} = passphraseAnswers;

  let password;
  switch (passphraseType) {
    case 'manual': {
      password = passphrase;
      break;
    }
    case 'generate': {
      password = stateModel.generatePassword();
      break;
    }
    default: throw new Error('Unexpected passphrase type');
  }

  if (!password) {
    throw new Error('Passphrase must be defined and cannot be empty.');
  }

  switch (source) {
    case 'manual': {
      const {privateKey} = answers;
      stateModel.privateKey = privateKey;
      await stateModel.storeNewEncryptedWallet(password);
      const address = await stateModel.getAddress();
      await stateModel.storeAddress(address);
      break;
    }
    case 'generate': {
      await stateModel.storeNewEncryptedWallet(password, true);
      const address = await stateModel.getAddress();
      await stateModel.storeAddress(address);
      break;
    }
    default: throw new Error('Unexpected source');
  }
};

const getPrivateKeyPhase = (stateModel, crypto, privateKeyDetectedDialog, askForPrivateKeyDialog, askForPassphraseDialog, askForPassphraseUnlockDialog) => async () => {
  await getPrivateKey(stateModel, askForPrivateKeyDialog, askForPassphraseDialog, askForPassphraseUnlockDialog);
  const {privateKey, passphrase} = stateModel;
  const address = await crypto.addressForPrivateKey(privateKey);
  await privateKeyDetectedDialog(address);
  return {privateKey, passphrase};
};

export default getPrivateKeyPhase;
