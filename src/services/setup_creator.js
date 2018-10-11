/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import {readFile, writeFile, getPath, makeDirectory} from '../utils/file';

export default class SetupCreator {
  constructor(templateDirectory, outputDirectory) {
    this.templateDirectory = templateDirectory;
    this.outputDirectory = outputDirectory;
  }

  async createPasswordFile(password) {
    await this.ensureOutputDirectoryExists();
    await writeFile(`${this.outputDirectory}password.pwds`, password);
  }

  async createKeyFile(encryptedWallet) {
    await this.ensureOutputDirectoryExists();
    await writeFile(`${this.outputDirectory}keyfile`, JSON.stringify(encryptedWallet, null, 2));
  }

  async prepareDockerComposeFile(nodeTypeName, privateKey, web3RPC, headContractAddress, networkName) {
    await this.ensureOutputDirectoryExists();
    let dockerFile = await readFile(`${this.templateDirectory}${nodeTypeName}/docker-compose.yml`);

    dockerFile = dockerFile.replace(/<ENTER_YOUR_PRIVATE_KEY_HERE>/gi, privateKey);
    dockerFile = dockerFile.replace(/<ENTER_YOUR_RPC_HERE>/gi, web3RPC);
    dockerFile = dockerFile.replace(/<ENTER_YOUR_HEAD_CONTRACT_ADDRESS_HERE>/gi, headContractAddress);
    dockerFile = dockerFile.replace(/<ENTER_NETWORK_NAME_HERE>/gi, networkName);

    await writeFile(`${this.outputDirectory}docker-compose.yml`, dockerFile);
  }

  async copyParityConfiguration(nodeTypeName, address) {
    await this.ensureOutputDirectoryExists();
    let parityConfigFile = await readFile(`${this.templateDirectory}${nodeTypeName}/parity_config.toml`);

    parityConfigFile = parityConfigFile.replace(/<TYPE_YOUR_ADDRESS_HERE>/gi, address);

    await writeFile(`${this.outputDirectory}parity_config.toml`, parityConfigFile);
  }

  async copyChainJson(networkName) {
    await this.ensureOutputDirectoryExists();
    const chainFile = await readFile(`${this.templateDirectory}chain_files/${networkName}.json`);
    const parsedChainJson = JSON.parse(chainFile);
    await writeFile(`${this.outputDirectory}chain.json`, chainFile);
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
