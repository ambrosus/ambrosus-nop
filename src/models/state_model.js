/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import path from 'path';
import {readFile} from '../utils/file';
import {HERMES, APOLLO, ATLAS_1, ATLAS_2, ATLAS_3} from '../consts';
import jsyaml from 'js-yaml';

const dockerFileName = 'docker-compose.yml';

export default class StateModel {
  constructor(store, crypto, setupCreator, privateKey, passphrase) {
    this.store = store;
    this.crypto = crypto;
    this.setupCreator = setupCreator;
    this.privateKey = privateKey;
    this.passphrase = passphrase;
  }

  async checkMailInfo() {
    // write default 'mailInfo' if it doesn't exist
    return await this.store.safeRead('mailInfo') || await this.store.write('mailInfo', {
      from: 'from',
      orgRegTo: 'orgRegTo',
      apiKey: 'apiKey',
      templateIds: {
        invite: 'invite',
        orgReq: 'orgReq',
        orgReqApprove: 'orgReqApprove',
        orgReqRefuse: 'orgReqRefuse'
      }
    });
  }

  async checkWorkerInterval() {
    // write default workerInterval if it doesn't exist
    return await this.store.safeRead('workerInterval') || await this.store.write('workerInterval', 300);
  }

  async checkStateVariables() {
    await this.checkWorkerInterval();
    await this.checkMailInfo();
  }

  async getWorkerInterval() {
    return this.store.safeRead('workerInterval');
  }

  async getNetwork() {
    return this.store.safeRead('network');
  }

  async storeNetwork(network) {
    await this.store.write('network', network);
  }

  async storeNewEncryptedWallet(password, generatePrivateKey = false) {
    if (generatePrivateKey === true) {
      this.privateKey = await this.crypto.generatePrivateKey();
    }

    const encryptedWallet = await this.crypto.getEncryptedWallet(this.privateKey, password);
    await this.store.write('encryptedWallet', encryptedWallet);
  }

  async getEncryptedWallet() {
    const encryptedWallet = await this.store.safeRead('encryptedWallet');
    if (!encryptedWallet) {
      return null;
    }

    return encryptedWallet;
  }

  async decryptWallet(password) {
    const encryptedWallet = await this.store.safeRead('encryptedWallet');
    const decryptedWallet = this.crypto.getDecryptedWallet(encryptedWallet, password);
    if (!decryptedWallet) {
      throw new Error(`Unable to decrypt the wallet`);
    }
  }

  generatePassword() {
    return this.crypto.getRandomPassword();
  }

  getPrivateKey() {
    if (this.privateKey) {
      return this.privateKey;
    }
    throw new Error(`Private key has not been initiated yet.`);
  }

  getPassphrase() {
    if (this.passphrase) {
      return this.passphrase;
    }
    throw new Error(`Passphrase has not been initiated yet.`);
  }

  getEncryptedKey() {
    return this.crypto.aesEncrypt(this.getPrivateKey(), this.getPassphrase());
  }

  async storePrivateKey(privateKey) {
    await this.store.write('privateKey', privateKey);
  }

  async getAddress() {
    const address = await this.store.safeRead('address');
    if (address) {
      return address;
    }
    const {privateKey} = this;
    return await this.crypto.addressForPrivateKey(privateKey);
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
    return this.store.safeRead('termsOfServiceSignature');
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

  async getMailInfo() {
    return this.store.safeRead('mailInfo');
  }

  async getExtraData(templateDirectory, nodeTypeName, dockerFileName) {
    const dockerFile = await readFile(path.join(templateDirectory, nodeTypeName, dockerFileName));

    const dockerYaml = await jsyaml.load(dockerFile);

    const parityVersion = dockerYaml.services.parity.image.split(':');

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
    const encryptedPrivateKey = this.getEncryptedKey();

    const {headContractAddress, chainspec, dockerTag, domain} = await this.getNetwork();

    const networkName = await this.setupCreator.fetchChainJson(chainspec);

    const workerInterval = await this.getWorkerInterval();

    await this.setupCreator.prepareDockerComposeFile(
      dockerTag,
      nodeTypeName,
      address,
      encryptedPrivateKey,
      headContractAddress,
      networkName,
      domain,
      await this.getNodeUrl(),
      await this.getMailInfo(),
      workerInterval
    );

    if (role === APOLLO) {
      const password = await this.generatePassword();
      await this.setupCreator.createPasswordFile(password);

      const encryptedWallet = this.crypto.getEncryptedWallet(this.privateKey, password);
      await this.setupCreator.createKeyFile(encryptedWallet);

      const nodeIp = await this.getNodeIP();
      const extraData = await this.getExtraData(this.setupCreator.templateDirectory, nodeTypeName, dockerFileName);
      await this.setupCreator.copyParityConfiguration(nodeTypeName, {address, ip: nodeIp, extraData});
    } else {
      await this.setupCreator.copyParityConfiguration(nodeTypeName, {});
    }
  }
}
