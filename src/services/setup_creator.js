/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import path from 'path';
import {readFile, writeFile, getPath, makeDirectory} from '../utils/file';
import fileDownload from '../utils/file_download';

const passwordFileName = 'password.pwds';
const keyFileName = 'keyfile';
const dockerFileName = 'docker-compose.yml';
const parityConfigFileName = 'parity_config.toml';
const chainDescriptionFileName = 'chain.json';
const tosFileName = 'TOS.txt';
const tosTextFileName = 'tos.txt';

export default class SetupCreator {
  constructor(templateDirectory, outputDirectory) {
    this.templateDirectory = templateDirectory;
    this.outputDirectory = outputDirectory;
  }

  async createPasswordFile(password) {
    await this.ensureOutputDirectoryExists();
    await writeFile(path.join(this.outputDirectory, passwordFileName), password);
  }

  async createKeyFile(encryptedWallet) {
    await this.ensureOutputDirectoryExists();
    await writeFile(path.join(this.outputDirectory, keyFileName), JSON.stringify(encryptedWallet, null, 2));
  }

  async readTosText() {
    return readFile(tosTextFileName);
  }

  async createTosFile(termsOfServiceText) {
    await this.ensureOutputDirectoryExists();
    await writeFile(path.join(this.outputDirectory, tosFileName), termsOfServiceText);
  }

  async prepareDockerComposeFile(tag, nodeTypeName, privateKey, headContractAddress, networkName, domain) {
    await this.ensureOutputDirectoryExists();
    let dockerFile = await readFile(path.join(this.templateDirectory, nodeTypeName, dockerFileName));

    dockerFile = dockerFile.replace(/<ENTER_DOCKER_TAG_HERE>/gi, tag);
    dockerFile = dockerFile.replace(/<ENTER_YOUR_PRIVATE_KEY_HERE>/gi, privateKey);
    dockerFile = dockerFile.replace(/<ENTER_YOUR_HEAD_CONTRACT_ADDRESS_HERE>/gi, headContractAddress);
    dockerFile = dockerFile.replace(/<ENTER_NETWORK_NAME_HERE>/gi, networkName);
    dockerFile = dockerFile.replace(/<ENTER_DOMAIN_HERE>/gi, domain);

    await writeFile(path.join(this.outputDirectory, dockerFileName), dockerFile);
  }

  async copyParityConfiguration(nodeTypeName, values) {
    await this.ensureOutputDirectoryExists();
    let parityConfigFile = await readFile(path.join(this.templateDirectory, nodeTypeName, parityConfigFileName));

    if (values.address !== undefined) {
      parityConfigFile = parityConfigFile.replace(/<TYPE_YOUR_ADDRESS_HERE>/gi, values.address);
    }

    if (values.ip !== undefined) {
      parityConfigFile = parityConfigFile.replace(/<TYPE_YOUR_IP_HERE>/gi, values.ip);
    }

    if (values.extraData !== undefined) {
      parityConfigFile = parityConfigFile.replace(/<TYPE_EXTRA_DATA_HERE>/gi, values.extraData);
    }

    await writeFile(path.join(this.outputDirectory, parityConfigFileName), parityConfigFile);
  }

  async fetchChainJson(chainSpecUrl) {
    await this.ensureOutputDirectoryExists();
    const outputFilePath = path.join(this.outputDirectory, chainDescriptionFileName);
    await fileDownload(chainSpecUrl, outputFilePath);
    const parsedChainJson = JSON.parse(await readFile(outputFilePath));
    return parsedChainJson.name;
  }

  async ensureOutputDirectoryExists() {
    try {
      await getPath(this.outputDirectory);
    } catch (error) {
      await makeDirectory(this.outputDirectory);
    }
  }
}
