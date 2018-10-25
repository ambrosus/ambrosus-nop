/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import path from 'path';
import {readFile, writeFile, getPath, makeDirectory} from '../utils/file';

const passwordFileName = 'password.pwds';
const keyFileName = 'keyfile';
const dockerFileName = 'docker-compose.yml';
const parityConfigFileName = 'parity_config.toml';
const chainTemplateDirectory = 'chain_files';
const chainDescriptionFileName = 'chain.json';

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

  async prepareDockerComposeFile(nodeTypeName, privateKey, headContractAddress, networkName) {
    await this.ensureOutputDirectoryExists();
    let dockerFile = await readFile(path.join(this.templateDirectory, nodeTypeName, dockerFileName));

    dockerFile = dockerFile.replace(/<ENTER_YOUR_PRIVATE_KEY_HERE>/gi, privateKey);
    dockerFile = dockerFile.replace(/<ENTER_YOUR_HEAD_CONTRACT_ADDRESS_HERE>/gi, headContractAddress);
    dockerFile = dockerFile.replace(/<ENTER_NETWORK_NAME_HERE>/gi, networkName);

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

    await writeFile(path.join(this.outputDirectory, parityConfigFileName), parityConfigFile);
  }

  async copyChainJson(networkName) {
    await this.ensureOutputDirectoryExists();
    const chainFile = await readFile(path.join(this.templateDirectory, chainTemplateDirectory, `${networkName}.json`));
    const parsedChainJson = JSON.parse(chainFile);
    await writeFile(path.join(this.outputDirectory, chainDescriptionFileName), chainFile);
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
