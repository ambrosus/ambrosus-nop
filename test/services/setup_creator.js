/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import chai from 'chai';
import nock from 'nock';
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
    const headAddressPlaceholder = '<ENTER_YOUR_HEAD_CONTRACT_ADDRESS_HERE>';
    const networkNamePlaceholder = '<ENTER_NETWORK_NAME_HERE>';

    const examplePrivateKey = '0xbeefcafe';
    const exampleHeadAddress = '0xdeadface';
    const exampleNetworkName = 'amb-net';

    const sampleForm = (arg1, arg2, arg3, arg4) => `${arg1} || ${arg2} || ${arg3} || ${arg4}`;

    const nodeTypeName = 'atlas';

    const templateFilePath = `${testInputDir}${nodeTypeName}/docker-compose.yml`;
    const destinationFilePath = `${testOutputDir}docker-compose.yml`;

    beforeEach(async () => {
      await makeDirectory(`${testInputDir}${nodeTypeName}`);
      await writeFile(templateFilePath, sampleForm(privateKeyPlaceholder, headAddressPlaceholder, networkNamePlaceholder));
    });

    afterEach(async () => {
      await removeFile(templateFilePath);
      await removeDirectory(`${testInputDir}${nodeTypeName}`);
      await removeFile(destinationFilePath);
    });

    it('creates file correctly', async () => {
      await setupCreator.prepareDockerComposeFile(nodeTypeName, examplePrivateKey, exampleHeadAddress, exampleNetworkName);
      expect(await readFile(destinationFilePath)).to.deep.equal(sampleForm(examplePrivateKey, exampleHeadAddress, exampleNetworkName));
    });
  });

  describe('copyParityConfiguration', () => {
    const exampleAddress = '0x123456789';
    const exampleIP = '10.0.0.1';

    const inputForm = `parity_config_contents... <TYPE_YOUR_ADDRESS_HERE> ... <TYPE_YOUR_IP_HERE>`;
    const formWithAddressReplaced = `parity_config_contents... ${exampleAddress} ... <TYPE_YOUR_IP_HERE>`;
    const formWithIPReplaced = `parity_config_contents... <TYPE_YOUR_ADDRESS_HERE> ... ${exampleIP}`;

    const nodeTypeName = 'apollo';
    const templateDir = `${testInputDir}${nodeTypeName}`;
    const srcParityConfigPath = `${templateDir}/parity_config.toml`;
    const destParityConfigPath = `${testOutputDir}parity_config.toml`;

    beforeEach(async () => {
      await makeDirectory(`${testInputDir}${nodeTypeName}`);
      await writeFile(srcParityConfigPath, inputForm);
    });

    afterEach(async () => {
      await removeFile(destParityConfigPath);
      await removeFile(srcParityConfigPath);
      await removeDirectory(`${testInputDir}${nodeTypeName}`);
    });

    it('copies files correctly and replaces the TYPE_YOUR_ADDRESS_HERE placeholder if address was provided', async () => {
      await setupCreator.copyParityConfiguration(nodeTypeName, {address: exampleAddress});
      expect(await readFile(destParityConfigPath)).to.equal(formWithAddressReplaced);
    });

    it('copies files correctly and replaces the TYPE_YOUR_IP_HERE placeholder if IP was provided', async () => {
      await setupCreator.copyParityConfiguration(nodeTypeName, {ip: exampleIP});
      expect(await readFile(destParityConfigPath)).to.equal(formWithIPReplaced);
    });
  });

  describe('fetchChainJson', () => {
    const chainSpecUrl = 'https://chainspec.ambrosus-dev.com/';
    const chainJsonContent = '{"name": "dev"}';
    const destChainJsonPath = `${testOutputDir}chain.json`;

    afterEach(async () => {
      nock.cleanAll();
      nock.enableNetConnect();
      await removeFile(destChainJsonPath);
    });

    it('downloads the chainspec for from given url', async () => {
      nock(chainSpecUrl)
        .get('/')
        .reply(200, chainJsonContent);

      const result = await setupCreator.fetchChainJson(chainSpecUrl);
      expect(await readFile(destChainJsonPath)).to.equal(chainJsonContent);
      expect(result).to.equal('dev');
    });

    it('throws when the server responds with code different from 200', async () => {
      nock(chainSpecUrl)
        .get('/')
        .reply(500);

      await expect(setupCreator.fetchChainJson(chainSpecUrl)).to.be.rejected;
    });
  });
});
