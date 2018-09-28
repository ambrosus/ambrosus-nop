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

  async getExistingNetwork() {
    if (await this.store.has('network')) {
      return await this.store.read('network');
    }
    return null;
  }

  async storeNetwork(network) {
    await this.store.write('network', network);
  }

  async generateAndStoreNewPrivateKey() {
    const privateKey = await this.crypto.generatePrivateKey();
    await this.storePrivateKey(privateKey);
    return privateKey;
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

  async getExistingAddress() {
    const privateKey = await this.getExistingPrivateKey();
    if (privateKey) {
      return this.crypto.addressForPrivateKey(privateKey);
    }
    return null;
  }

  async getExistingRole() {
    if (await this.store.has('role')) {
      return await this.store.read('role');
    }
    return null;
  }

  async storeRole(role) {
    await this.store.write('role', role);
  }

  async getExistingNodeUrl() {
    if (await this.store.has('url')) {
      return await this.store.read('url');
    }
    return null;
  }

  async storeNodeUrl(url) {
    await this.store.write('url', url);
  }

  async getExistingUserEmail() {
    if (await this.store.has('email')) {
      return await this.store.read('email');
    }
    return null;
  }

  async storeUserEmail(email) {
    await this.store.write('email', email);
  }

  async assembleSubmission() {
    const privateKey = await this.getExistingPrivateKey();
    return {
      address: await this.crypto.addressForPrivateKey(privateKey),
      role: await this.getExistingRole(),
      url: await this.getExistingNodeUrl(),
      email: await this.getExistingUserEmail()
    };
  }
}
