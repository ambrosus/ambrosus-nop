/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

const getPrivateKeyPhase = (store, crypto, askForPrivateKeyDialog) => async () => {
  if (await store.has('privateKey')) {
    return await store.read('privateKey');
  }

  const answers = await askForPrivateKeyDialog();
  const {source} = answers;
  switch (source) {
    case 'manual': {
      const {privateKey} = answers;
      await store.write('privateKey', privateKey);
      return privateKey;
    }
    case 'generate': {
      const privateKey = await crypto.generatePrivateKey();
      await store.write('privateKey', privateKey);
      return privateKey;
    }
    default:
      throw new Error('Unexpected source');
  }
};

export default getPrivateKeyPhase;

