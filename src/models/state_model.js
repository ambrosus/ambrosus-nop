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

  async getRole() {
    if (await this.store.has('role')) {
      return await this.store.read('role');
    }
    return null;
  }

  async storeRole(role) {
    await this.store.write('role', role);
  }

  async getNodeUrl() {
    if (await this.store.has('url')) {
      return await this.store.read('url');
    }
    return null;
  }

  async storeNodeUrl(url) {
    await this.store.write('url', url);
  }

  async getUserEmail() {
    if (await this.store.has('email')) {
      return await this.store.read('email');
    }
    return null;
  }

  async storeUserEmail(email) {
    await this.store.write('email', email);
  }

  async getWeb3RPCForNetwork() {
    if (await this.store.has('network')) {
      const {rpc} = await this.store.read('network');
      return rpc;
    }
    return null;
  }

  async getHeadContractAddressForNetwork() {
    if (await this.store.has('network')) {
      const {headContractAddress} = await this.store.read('network');
      return headContractAddress;
    }
    return null;
  }

  async getNameForNetwork() {
    if (await this.store.has('network')) {
      const {name} = await this.store.read('network');
      return name;
    }
    return null;
  }

  async assembleSubmission() {
    const privateKey = await this.getExistingPrivateKey();
    return {
      address: await this.crypto.addressForPrivateKey(privateKey),
      role: await this.getRole(),
      url: await this.getNodeUrl(),
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

    const privateKey = await this.getExistingPrivateKey();
    if (role === APOLLO) {
      const password = this.crypto.getRandomPassword();
      await this.setupCreator.createPasswordFile(password);

      const encryptedWallet = this.crypto.getEncryptedWallet(privateKey, password);
      await this.setupCreator.createKeyFile(encryptedWallet);
    }

    const networkAlias = await this.getNameForNetwork();
    const networkName = await this.setupCreator.copyChainJson(networkAlias);

    const address = await this.getExistingAddress();
    this.setupCreator.copyParityConfiguration(nodeTypeName, address);

    const web3RPC = await this.getWeb3RPCForNetwork();
    const headContractAddress = await this.getHeadContractAddressForNetwork();

    await this.setupCreator.prepareDockerComposeFile(nodeTypeName, privateKey, web3RPC, headContractAddress, networkName);
  }
}
