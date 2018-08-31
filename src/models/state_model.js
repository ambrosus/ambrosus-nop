/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

export default class StateModel {
  constructor(store, crypto) {
    this.store = store;
    this.crypto = crypto;
  }

  async getExistingPrivateKey() {
    if (await this.store.has('privateKey')) {
      return await this.store.read('privateKey');
    }
    return null;
  }

  async storePrivateKey(privateKey) {
    await this.store.write('privateKey', privateKey);
  }

  async generateAndStoreNewPrivateKey() {
    const privateKey = await this.crypto.generatePrivateKey();
    await this.storePrivateKey(privateKey);
    return privateKey;
  }

  async storeRole(role) {
    await this.store.write('role', role);
  }
}
