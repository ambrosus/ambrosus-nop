/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

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

  beforeEach(async () => {
    await makeDirectory(testInputDir);
    await makeDirectory(testOutputDir);
  });

  afterEach(async () => {
    await removeDirectory(testInputDir);
    await removeDirectory(testOutputDir);
  });

  before(async () => {
    SetupCreator.templateDirectory = testInputDir;
    SetupCreator.outputDirectory = testOutputDir;
  });

  describe('createPasswordFile', () => {
    const examplePassword = '0x1234deadface';
    const passwordFilePath = `${testOutputDir}password.pwds`;

    afterEach(async () => {
      await removeFile(passwordFilePath);
    });

    it('creates file correctly', async () => {
      await SetupCreator.createPasswordFile(examplePassword);
      expect(await readFile(passwordFilePath)).to.equal(examplePassword);
    });
  });

  describe('createTosFile', () => {
    const exampleTosText = '0x1234deadface';
    const tosFilePath = `${testOutputDir}TOS.txt`;

    afterEach(async () => {
      await removeFile(tosFilePath);
    });

    it('creates file correctly', async () => {
      await SetupCreator.createTosFile(exampleTosText);
      expect(await readFile(tosFilePath)).to.equal(exampleTosText);
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
      await SetupCreator.createKeyFile(exampleEncryptedWallet);
      expect(JSON.parse(await readFile(keyFilePath))).to.deep.equal(exampleEncryptedWallet);
    });
  });

  describe('prepareDockerComposeFile', () => {
    const tagPlaceholder = '<ENTER_DOCKER_TAG_HERE>';
    const addressPlaceholder = '<ENTER_YOUR_ADDRESS_HERE>';
    const privateKeyPlaceholder = '<ENTER_YOUR_PRIVATE_KEY_HERE>';
    const headAddressPlaceholder = '<ENTER_YOUR_HEAD_CONTRACT_ADDRESS_HERE>';
    const networkNamePlaceholder = '<ENTER_NETWORK_NAME_HERE>';
    const domainPlaceholder = '<ENTER_DOMAIN_HERE>';

    const exampleAddress = '0xadd4eeee';
    const examplePrivateKey = '0xbeefcafe';
    const exampleHeadAddress = '0xdeadface';
    const exampleNetworkName = 'amb-net';
    const exampleTag = '7654321';
    const exampleDomain = 'ambrosus-dev.com';

    const sampleForm = (arg1, arg2, arg3, arg4, arg5, arg6) => `${arg1} || ${arg2} || ${arg3} || ${arg4} || ${arg5} || ${arg6}`;

    const nodeTypeName = 'atlas';
    const nodeDir = `${testInputDir}${nodeTypeName}`;
    const templateDir = `${nodeDir}/${exampleNetworkName}`;

    const templateFilePath = `${templateDir}/docker-compose.yml`;
    const destinationFilePath = `${testOutputDir}docker-compose.yml`;

    beforeEach(async () => {
      await makeDirectory(nodeDir);
      await makeDirectory(templateDir);
      await writeFile(templateFilePath, sampleForm(tagPlaceholder, addressPlaceholder, privateKeyPlaceholder, headAddressPlaceholder, networkNamePlaceholder, domainPlaceholder));
    });

    afterEach(async () => {
      await removeFile(templateFilePath);
      await removeDirectory(templateDir);
      await removeDirectory(nodeDir);
      await removeFile(destinationFilePath);
    });

    it('creates file correctly', async () => {
      await SetupCreator.prepareDockerComposeFile(exampleTag, nodeTypeName, exampleAddress, examplePrivateKey, exampleHeadAddress, exampleNetworkName, exampleDomain);
      expect(await readFile(destinationFilePath)).to.deep.equal(sampleForm(exampleTag, exampleAddress, examplePrivateKey, exampleHeadAddress, exampleNetworkName, exampleDomain));
    });
  });

  describe('copyParityConfiguration', () => {
    const exampleAddress = '0x123456789';
    const exampleIP = '10.0.0.1';

    const inputForm = `parity_config_contents... <TYPE_YOUR_ADDRESS_HERE> ... <TYPE_YOUR_IP_HERE>`;
    const formWithAddressReplaced = `parity_config_contents... ${exampleAddress} ... <TYPE_YOUR_IP_HERE>`;
    const formWithIPReplaced = `parity_config_contents... <TYPE_YOUR_ADDRESS_HERE> ... ${exampleIP}`;

    const nodeTypeName = 'apollo';
    const exampleNetworkName = 'ambnet-dev';
    const nodeDir = `${testInputDir}${nodeTypeName}`;
    const templateDir = `${nodeDir}/${exampleNetworkName}`;
    const srcParityConfigPath = `${templateDir}/parity_config.toml`;
    const destParityConfigPath = `${testOutputDir}parity_config.toml`;

    beforeEach(async () => {
      await makeDirectory(nodeDir);
      await makeDirectory(templateDir);
      await writeFile(srcParityConfigPath, inputForm);
    });

    afterEach(async () => {
      await removeFile(destParityConfigPath);
      await removeFile(srcParityConfigPath);
      await removeDirectory(templateDir);
      await removeDirectory(nodeDir);
    });

    it('copies files correctly and replaces the TYPE_YOUR_ADDRESS_HERE placeholder if address was provided', async () => {
      await SetupCreator.copyParityConfiguration(nodeTypeName, exampleNetworkName, {address: exampleAddress});
      expect(await readFile(destParityConfigPath)).to.equal(formWithAddressReplaced);
    });

    it('copies files correctly and replaces the TYPE_YOUR_IP_HERE placeholder if IP was provided', async () => {
      await SetupCreator.copyParityConfiguration(nodeTypeName, exampleNetworkName, {ip: exampleIP});
      expect(await readFile(destParityConfigPath)).to.equal(formWithIPReplaced);
    });
  });

  describe('fetchChainJson', () => {
    const chainSpecUrl = 'https://chainspec.ambrosus-dev.com/';
    const chainJsonContent = '{"name": "dev"}';
    const destChainJsonPath = `${testOutputDir}chain.json`;

    beforeEach(() => {
      if (!nock.isActive()) {
        nock.activate();
      }
    });

    afterEach(async () => {
      nock.cleanAll();
      nock.restore();
      await removeFile(destChainJsonPath);
    });

    it('downloads the chainspec from given url', async () => {
      nock(chainSpecUrl)
        .get('/')
        .reply(200, chainJsonContent);

      const result = await SetupCreator.fetchChainJson(chainSpecUrl);
      expect(await readFile(destChainJsonPath)).to.equal(chainJsonContent);
      expect(result).to.equal('dev');
    });

    it('throws when the server responds with code different from 200', async () => {
      nock(chainSpecUrl)
        .get('/')
        .reply(500);

      await expect(SetupCreator.fetchChainJson(chainSpecUrl)).to.be.rejected;
    });
  });
});
