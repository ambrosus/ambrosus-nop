/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import {HERMES, APOLLO, ATLAS_1, ATLAS_2, ATLAS_3} from '../consts';

export default class StateModel {
  constructor(store, crypto, setupCreator) {
    this.store = store;
    this.crypto = crypto;
    this.setupCreator = setupCreator;
  }

  async getNetwork() {
    return this.store.safeRead('network');
  }

  async storeNetwork(network) {
    await this.store.write('network', network);
  }

  async generateAndStoreNewPrivateKey() {
    const privateKey = await this.crypto.generatePrivateKey();
    await this.storePrivateKey(privateKey);
    return privateKey;
  }

  async getPrivateKey() {
    return this.store.safeRead('privateKey');
  }

  async storePrivateKey(privateKey) {
    await this.store.write('privateKey', privateKey);
  }

  async getAddress() {
    const privateKey = await this.getPrivateKey();
    if (privateKey) {
      return this.crypto.addressForPrivateKey(privateKey);
    }
    return null;
  }

  async getRole() {
    return this.store.safeRead('role');
  }

  async storeRole(role) {
    await this.store.write('role', role);
  }

  async getNodeUrl() {
    return this.store.safeRead('url');
  }

  async storeNodeUrl(url) {
    await this.store.write('url', url);
  }

  async getNodeIP() {
    return this.store.safeRead('ip');
  }

  async storeNodeIP(ip) {
    await this.store.write('ip', ip);
  }

  async getUserEmail() {
    return this.store.safeRead('email');
  }

  async storeUserEmail(email) {
    await this.store.write('email', email);
  }

  async assembleSubmission() {
    const privateKey = await this.getPrivateKey();
    return {
      network: (await this.getNetwork()).name,
      address: await this.crypto.addressForPrivateKey(privateKey),
      role: await this.getRole(),
      url: await this.getNodeUrl(),
      ip: await this.getNodeIP(),
      email: await this.getUserEmail()
    };
  }

  async prepareSetupFiles() {
    const role = await this.getRole();
    let nodeTypeName;

    if (role === HERMES) {
      nodeTypeName = 'hermes';
    } else if (role === APOLLO) {
      nodeTypeName = 'apollo';
    } else if (role === ATLAS_1 || role === ATLAS_2 || role === ATLAS_3) {
      nodeTypeName = 'atlas';
    } else {
      throw new Error('Invalid role');
    }

    const privateKey = await this.getPrivateKey();

    const {name: networkAlias, headContractAddress} = await this.getNetwork();
    const networkName = await this.setupCreator.copyChainJson(networkAlias);

    await this.setupCreator.prepareDockerComposeFile(nodeTypeName, privateKey, headContractAddress, networkName);

    if (role === APOLLO) {
      const password = this.crypto.getRandomPassword();
      await this.setupCreator.createPasswordFile(password);

      const encryptedWallet = this.crypto.getEncryptedWallet(privateKey, password);
      await this.setupCreator.createKeyFile(encryptedWallet);

      const address = await this.getAddress();
      const nodeIp = await this.getNodeIP();
      await this.setupCreator.copyParityConfiguration(nodeTypeName, {address, ip: nodeIp});
    } else {
      await this.setupCreator.copyParityConfiguration(nodeTypeName, {});
    }
  }
}
