/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import path from 'path';
import {readFile} from '../utils/file';
import {HERMES, APOLLO, ATLAS_1, ATLAS_2, ATLAS_3} from '../consts';
import jsyaml from 'js-yaml';

const dockerFileName = 'docker-compose.yml';

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

  async storeAddress(address) {
    await this.store.write('address', address);
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

  async getApolloMinimalDeposit() {
    return this.store.safeRead('apolloMinimalDeposit');
  }

  async storeApolloMinimalDeposit(deposit) {
    await this.store.write('apolloMinimalDeposit', deposit);
  }

  async getSignedTos() {
    return  this.store.safeRead('termsOfServiceSignature');
  }

  async storeSignedTos(tosSignature) {
    await this.store.write('termsOfServiceSignature', tosSignature);
  }

  async storeTosHash(tosHash) {
    await this.store.write('termsOfServiceHash', tosHash);
  }

  async getTosHash() {
    return this.store.safeRead('termsOfServiceHash');
  }

  async getExtraData(templateDirectory, nodeTypeName, dockerFileName) {
    const dockerFile = await readFile(path.join(templateDirectory, nodeTypeName, dockerFileName));

    const dockertYaml = await jsyaml.load(dockerFile);

    const parityVersion = dockertYaml.services.parity.image.split(':');

    return `Apollo ${parityVersion[1]}`;
  }

  async assembleSubmission() {
    const privateKey = await this.getPrivateKey();
    const submissionForm = {
      network: (await this.getNetwork()).name,
      address: await this.crypto.addressForPrivateKey(privateKey),
      role: await this.getRole(),
      email: await this.getUserEmail(),
      termsOfServiceHash: await this.getTosHash(),
      termsOfServiceSignature: await this.getSignedTos()
    };
    if (await this.getNodeUrl()) {
      submissionForm.url = await this.getNodeUrl();
    }
    if (await this.getNodeIP()) {
      submissionForm.ip = await this.getNodeIP();
    }
    if (await this.getApolloMinimalDeposit()) {
      submissionForm.depositInAMB = await this.getApolloMinimalDeposit();
    }
    return submissionForm;
  }

  async readTosText() {
    return this.setupCreator.readTosText();
  }

  async createTosFile(termsOfServiceText) {
    await this.setupCreator.createTosFile(termsOfServiceText);
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

    const address = await this.getAddress();
    const privateKey = await this.getPrivateKey();

    const {headContractAddress, chainspec, dockerTag, domain} = await this.getNetwork();

    const networkName = await this.setupCreator.fetchChainJson(chainspec);

    await this.setupCreator.prepareDockerComposeFile(dockerTag, nodeTypeName, address, privateKey, headContractAddress, networkName, domain);

    if (role === APOLLO) {
      const password = this.crypto.getRandomPassword();
      await this.setupCreator.createPasswordFile(password);

      const encryptedWallet = this.crypto.getEncryptedWallet(privateKey, password);
      await this.setupCreator.createKeyFile(encryptedWallet);

      const nodeIp = await this.getNodeIP();
      const extraData = await this.getExtraData(this.setupCreator.templateDirectory, nodeTypeName, dockerFileName);
      await this.setupCreator.copyParityConfiguration(nodeTypeName, {address, ip: nodeIp, extraData});
    } else {
      await this.setupCreator.copyParityConfiguration(nodeTypeName, {});
    }
  }
}
