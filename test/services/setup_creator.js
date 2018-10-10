/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import SetupCreator from '../../src/services/setup_creator';
import {readFile, writeFile, removeFile, makeDirectory, removeDirectory} from '../../src/utils/file';

chai.use(chaiAsPromised);
const {expect} = chai;

describe('Setup Creator', () => {
  const testInputDir = './testInputDir/';
  const testOutputDir = './testOutputDir/';
  let setupCreator;

  beforeEach(async () => {
    await makeDirectory(testInputDir);
    await makeDirectory(testOutputDir);
  });

  afterEach(async () => {
    await removeDirectory(testInputDir);
    await removeDirectory(testOutputDir);
  });

  before(async () => {
    setupCreator = new SetupCreator(testInputDir, testOutputDir);
  });

  describe('createPasswordFile', () => {
    const examplePassword = '0x1234deadface';
    const passwordFilePath = `${testOutputDir}password.pwds`;

    afterEach(async () => {
      await removeFile(passwordFilePath);
    });

    it('creates file correctly', async () => {
      await setupCreator.createPasswordFile(examplePassword);
      expect(await readFile(passwordFilePath)).to.equal(examplePassword);
    });
  });

  describe('createKeyFile', () => {
    const exampleEncryptedWallet = {
      fo: 'o',
      ba: 'r'
    };
    const keyFilePath = `${testOutputDir}keyfile`;

    afterEach(async () => {
      await removeFile(keyFilePath);
    });

    it('creates file correctly', async () => {
      await setupCreator.createKeyFile(exampleEncryptedWallet);
      expect(JSON.parse(await readFile(keyFilePath))).to.deep.equal(exampleEncryptedWallet);
    });
  });

  describe('prepareDockerComposeFile', () => {
    const privateKeyPlaceholder = '<ENTER_YOUR_PRIVATE_KEY_HERE>';
    const rpcPlaceholder = '<ENTER_YOUR_RPC_HERE>';
    const headAddressPlaceholder = '<ENTER_YOUR_HEAD_CONTRACT_ADDRESS_HERE>';

    const examplePrivateKey = '0xbeefcafe';
    const exampleRpc = 'http://localhost:8545';
    const exampleHeadAddress = '0xdeadface';

    const sampleForm = (arg1, arg2, arg3) => `${arg1} || ${arg2} || ${arg3}`;

    const nodeTypeName = 'atlas';

    const templateFilePath = `${testInputDir}${nodeTypeName}/docker-compose.yml`;
    const destinationFilePath = `${testOutputDir}docker-compose.yml`;

    beforeEach(async () => {
      await makeDirectory(`${testInputDir}${nodeTypeName}`);
      await writeFile(templateFilePath, sampleForm(privateKeyPlaceholder, rpcPlaceholder, headAddressPlaceholder));
    });

    afterEach(async () => {
      await removeFile(templateFilePath);
      await removeDirectory(`${testInputDir}${nodeTypeName}`);
      await removeFile(destinationFilePath);
    });

    it('creates file correctly', async () => {
      await setupCreator.prepareDockerComposeFile(nodeTypeName, examplePrivateKey, exampleRpc, exampleHeadAddress);
      expect(await readFile(destinationFilePath)).to.deep.equal(sampleForm(examplePrivateKey, exampleRpc, exampleHeadAddress));
    });
  });

  describe('copyParityConfiguration', () => {
    const nodeTypeName = 'apollo';
    const parityConfigContents = 'parity_config_contents';
    const chainJsonContents = 'chain_json_contents';
    const srcParityConfigPath = `${testInputDir}${nodeTypeName}/parity_config.toml`;
    const srcChainJsonPath = `${testInputDir}${nodeTypeName}/chain.json`;
    const destParityConfigPath = `${testOutputDir}parity_config.toml`;
    const destChainJsonPath = `${testOutputDir}chain.json`;

    beforeEach(async () => {
      await makeDirectory(`${testInputDir}${nodeTypeName}`);
      await writeFile(srcParityConfigPath, parityConfigContents);
      await writeFile(srcChainJsonPath, chainJsonContents);
    });

    afterEach(async () => {
      await removeFile(destParityConfigPath);
      await removeFile(destChainJsonPath);
      await removeFile(srcParityConfigPath);
      await removeFile(srcChainJsonPath);
      await removeDirectory(`${testInputDir}${nodeTypeName}`);
    });

    it('copies files correctly', async () => {
      await setupCreator.copyParityConfiguration(nodeTypeName);
      expect(await readFile(destParityConfigPath)).to.equal(parityConfigContents);
      expect(await readFile(destChainJsonPath)).to.equal(chainJsonContents);
    });
  });
});
