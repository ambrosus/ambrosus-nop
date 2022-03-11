/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import * as path from 'path';
import {readFile} from '../utils/file';
import {HERMES, APOLLO, ATLAS_1, ATLAS_2, ATLAS_3} from '../consts';
import jsyaml from 'js-yaml';
import Store from '../services/store';
import Crypto from '../services/crypto';
import SetupCreator from '../services/setup_creator';

const dockerFileName = 'docker-compose.yml';

class StateModel {
  async checkMailInfo() {
    // write default 'mailInfo' if it doesn't exist
    return await Store.safeRead('mailInfo') || await Store.write('mailInfo', {
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
    return await Store.safeRead('workerInterval') || await Store.write('workerInterval', 300);
  }

  async checkStateVariables() {
    await this.checkWorkerInterval();
    await this.checkMailInfo();
  }

  async getWorkerInterval() {
    return Store.safeRead('workerInterval');
  }

  async getNetwork() {
    return Store.safeRead('network');
  }

  async storeNetwork(network) {
    await Store.write('network', network);
  }

  async generateAndStoreNewPrivateKey() {
    const privateKey = await Crypto.generatePrivateKey();
    await this.storePrivateKey(privateKey);
    return privateKey;
  }

  async getPrivateKey() {
    return Store.safeRead('privateKey');
  }

  async storePrivateKey(privateKey) {
    await Store.write('privateKey', privateKey);
  }

  async getAddress() {
    const privateKey = await this.getPrivateKey();
    if (privateKey) {
      return Crypto.addressForPrivateKey(privateKey);
    }
    return null;
  }

  async storeAddress(address) {
    await Store.write('address', address);
  }

  async getRole() {
    return Store.safeRead('role');
  }

  async storeRole(role) {
    await Store.write('role', role);
  }

  async removeRole() {
    await Store.clear('role');
  }

  async getNodeUrl() {
    return Store.safeRead('url');
  }

  async storeNodeUrl(url) {
    await Store.write('url', url);
  }

  async getNodeIP() {
    return Store.safeRead('ip');
  }

  async storeNodeIP(ip) {
    await Store.write('ip', ip);
  }

  async getUserEmail() {
    return Store.safeRead('email');
  }

  async storeUserEmail(email) {
    await Store.write('email', email);
  }

  async getApolloMinimalDeposit() {
    return Store.safeRead('apolloMinimalDeposit');
  }

  async storeApolloMinimalDeposit(deposit) {
    await Store.write('apolloMinimalDeposit', deposit);
  }

  async getSignedTos() {
    return Store.safeRead('termsOfServiceSignature');
  }

  async storeSignedTos(tosSignature) {
    await Store.write('termsOfServiceSignature', tosSignature);
  }

  async storeTosHash(tosHash) {
    await Store.write('termsOfServiceHash', tosHash);
  }

  async getTosHash() {
    return Store.safeRead('termsOfServiceHash');
  }

  async getMailInfo() {
    return Store.safeRead('mailInfo');
  }

  async getExtraData(templateDirectory, nodeTypeName, networkName, dockerFileName) {
    const dockerFile = await readFile(path.join(templateDirectory, nodeTypeName, networkName.replace('ambnet-', ''), dockerFileName));

    const dockerYaml = await jsyaml.load(dockerFile);

    const parityVersion = dockerYaml.services.parity.image.split(':');

    return `Apollo ${parityVersion[1]}`;
  }

  async assembleSubmission() {
    const privateKey = await this.getPrivateKey();
    const submissionForm: any = {
      network: (await this.getNetwork()).name,
      address: await Crypto.addressForPrivateKey(privateKey),
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
    return SetupCreator.readTosText();
  }

  async createTosFile(termsOfServiceText) {
    await SetupCreator.createTosFile(termsOfServiceText);
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

    const networkName = await SetupCreator.fetchChainJson(chainspec);

    const workerInterval = await this.getWorkerInterval();

    await SetupCreator.prepareDockerComposeFile(
      dockerTag,
      nodeTypeName,
      address,
      privateKey,
      headContractAddress,
      networkName,
      domain,
      await this.getNodeUrl(),
      await this.getMailInfo(),
      workerInterval
    );

    if (role === APOLLO) {
      const password = Crypto.getRandomPassword();
      await SetupCreator.createPasswordFile(password);

      const encryptedWallet = Crypto.getEncryptedWallet(privateKey, password);
      await SetupCreator.createKeyFile(encryptedWallet);

      const nodeIp = await this.getNodeIP();
      const extraData = await this.getExtraData(SetupCreator.templateDirectory,  nodeTypeName, networkName, dockerFileName);
      await SetupCreator.copyParityConfiguration(nodeTypeName, networkName, {address, ip: nodeIp, extraData});
    } else {
      await SetupCreator.copyParityConfiguration(nodeTypeName, networkName, {});
    }
  }
}

export default new StateModel();
