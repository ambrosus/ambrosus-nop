/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import StateModel from '../../src/models/state_model';
import {APOLLO, HERMES} from '../../src/consts';

chai.use(chaiAsPromised);
chai.use(sinonChai);
const {expect} = chai;

describe('State Model', () => {
  let cryptoStub;
  let storeStub;
  let setupCreatorStub;
  let stateModel;

  const examplePrivateKey = '0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709';
  const exampleAddress = '0xB1D28124D5771dD347a0BDECbC72CFb2BFf4B2D7';
  const exampleRole = APOLLO;
  const exampleUrl = 'https://amb-node.com';
  const exampleIP = '10.45.1.1';
  const exampleEmail = 'amb_node_operator@mail.com';
  const exampleNetwork = {
    rpc: 'localhost:8545',
    headContractAddress: '0x00000f10',
    name: 'dev'
  };
  const exampleNetworkFullName = 'AMB-DEV';
  const examplePassword = 'randomBytes';
  const exampleEncryptedWallet = {foo: 'bar'};

  beforeEach(async () => {
    storeStub = {
      safeRead: sinon.stub(),
      write: sinon.stub()
    };
    cryptoStub = {
      generatePrivateKey: sinon.stub().resolves(examplePrivateKey),
      addressForPrivateKey: sinon.stub().withArgs(examplePrivateKey)
        .resolves(exampleAddress),
      getRandomPassword: sinon.stub().returns(examplePassword),
      getEncryptedWallet: sinon.stub().withArgs(examplePrivateKey, examplePassword)
        .returns(exampleEncryptedWallet)
    };
    setupCreatorStub = {
      copyParityConfiguration: sinon.stub(),
      createPasswordFile: sinon.stub(),
      createKeyFile: sinon.stub(),
      prepareDockerComposeFile: sinon.stub(),
      copyChainJson: sinon.stub()
    };
    stateModel = new StateModel(storeStub, cryptoStub, setupCreatorStub);
  });

  describe('getNetwork', () => {
    beforeEach(async () => {
      storeStub.safeRead.resolves(exampleNetwork);
    });

    it('returns network if one exists', async () => {
      expect(await stateModel.getNetwork()).to.equal(exampleNetwork);
      expect(storeStub.safeRead).to.have.been.calledOnceWith('network');
    });
  });

  describe('storeNetwork', () => {
    it('stores the network', async () => {
      await expect(stateModel.storeNetwork(exampleNetwork)).to.be.eventually.fulfilled;
      expect(storeStub.write).to.have.been.calledOnceWith('network', exampleNetwork);
    });
  });

  describe('generateAndStoreNewPrivateKey', () => {
    it('generates new private key', async () => {
      await expect(stateModel.generateAndStoreNewPrivateKey()).to.be.eventually.fulfilled;
      expect(cryptoStub.generatePrivateKey).to.have.been.calledOnceWith();
    });

    it('stores newly generated private key', async () => {
      await expect(stateModel.generateAndStoreNewPrivateKey()).to.be.eventually.fulfilled;
      expect(storeStub.write).to.have.been.calledOnceWith('privateKey', examplePrivateKey);
    });
  });

  describe('getPrivateKey', () => {
    beforeEach(async () => {
      storeStub.safeRead.resolves(examplePrivateKey);
    });

    it('returns private key if one exists', async () => {
      expect(await stateModel.getPrivateKey()).to.equal(examplePrivateKey);
      expect(storeStub.safeRead).to.have.been.calledOnceWith('privateKey');
    });
  });

  describe('storePrivateKey', () => {
    it('stores private key', async () => {
      await expect(stateModel.storePrivateKey(examplePrivateKey)).to.be.eventually.fulfilled;
      expect(storeStub.write).to.have.been.calledOnceWith('privateKey', examplePrivateKey);
    });
  });

  describe('getAddress', () => {
    beforeEach(async () => {
      storeStub.safeRead.resolves(examplePrivateKey);
    });

    it('converts private key to address if one exists', async () => {
      expect(await stateModel.getAddress()).to.equal(exampleAddress);
      expect(storeStub.safeRead).to.have.been.calledOnceWith('privateKey');
      expect(cryptoStub.addressForPrivateKey).to.have.been.calledOnceWith(examplePrivateKey);
    });
  });

  describe('getRole', () => {
    beforeEach(async () => {
      storeStub.safeRead.resolves(exampleRole);
    });

    it('returns role if one exists', async () => {
      expect(await stateModel.getRole()).to.equal(exampleRole);
      expect(storeStub.safeRead).to.have.been.calledOnceWith('role');
    });
  });

  describe('storeRole', () => {
    it('stores role', async () => {
      await expect(stateModel.storeRole(exampleRole)).to.be.eventually.fulfilled;
      expect(storeStub.write).to.have.been.calledOnceWith('role', exampleRole);
    });
  });

  describe('getNodeUrl', () => {
    beforeEach(async () => {
      storeStub.safeRead.resolves(exampleUrl);
    });

    it('returns node url if one exists', async () => {
      expect(await stateModel.getNodeUrl()).to.equal(exampleUrl);
      expect(storeStub.safeRead).to.have.been.calledOnceWith('url');
    });
  });

  describe('storeNodeUrl', () => {
    it('stores url', async () => {
      await expect(stateModel.storeNodeUrl(exampleUrl)).to.be.eventually.fulfilled;
      expect(storeStub.write).to.have.been.calledOnceWith('url', exampleUrl);
    });
  });

  describe('storeNodeIP', () => {
    it('stores IP', async () => {
      await expect(stateModel.storeNodeIP(exampleIP)).to.be.eventually.fulfilled;
      expect(storeStub.write).to.have.been.calledOnceWith('ip', exampleIP);
    });
  });

  describe('getNodeIP', () => {
    beforeEach(async () => {
      storeStub.safeRead.resolves(exampleIP);
    });

    it('returns node url if one exists', async () => {
      expect(await stateModel.getNodeIP()).to.equal(exampleIP);
      expect(storeStub.safeRead).to.have.been.calledOnceWith('ip');
    });
  });

  describe('getUserEmail', () => {
    beforeEach(async () => {
      storeStub.safeRead.resolves(exampleEmail);
    });

    it('returns user email if one exists', async () => {
      expect(await stateModel.getUserEmail()).to.equal(exampleEmail);
      expect(storeStub.safeRead).to.have.been.calledOnceWith('email');
    });
  });

  describe('storeUserEmail', () => {
    it('stores user email', async () => {
      await expect(stateModel.storeUserEmail(exampleEmail)).to.be.eventually.fulfilled;
      expect(storeStub.write).to.have.been.calledOnceWith('email', exampleEmail);
    });
  });

  describe('assembleSubmission', () => {
    const assembledSubmission = {
      network: exampleNetwork.name,
      address: exampleAddress,
      role: exampleRole,
      url: exampleUrl,
      ip: exampleIP,
      email: exampleEmail
    };

    beforeEach(async () => {
      storeStub.safeRead.withArgs('privateKey').resolves(examplePrivateKey);
      storeStub.safeRead.withArgs('role').resolves(exampleRole);
      storeStub.safeRead.withArgs('url').resolves(exampleUrl);
      storeStub.safeRead.withArgs('ip').resolves(exampleIP);
      storeStub.safeRead.withArgs('email').resolves(exampleEmail);
      storeStub.safeRead.withArgs('network').resolves(exampleNetwork);
    });

    it('assembles submission', async () => {
      expect(await stateModel.assembleSubmission()).to.deep.equal(assembledSubmission);
      expect(storeStub.safeRead).to.have.callCount(6);
      expect(storeStub.safeRead).to.have.been.calledWith('privateKey');
      expect(storeStub.safeRead).to.have.been.calledWith('role');
      expect(storeStub.safeRead).to.have.been.calledWith('url');
      expect(storeStub.safeRead).to.have.been.calledWith('ip');
      expect(storeStub.safeRead).to.have.been.calledWith('email');
      expect(storeStub.safeRead).to.have.been.calledWith('network');
      expect(cryptoStub.addressForPrivateKey).to.have.been.calledOnceWith(examplePrivateKey);
    });
  });

  describe('prepareSetupFiles', async () => {
    it('creates files for Apollo', async () => {
      storeStub.safeRead.withArgs('role').resolves(APOLLO)
        .withArgs('privateKey')
        .resolves(examplePrivateKey)
        .withArgs('ip')
        .resolves(exampleIP)
        .withArgs('network')
        .resolves(exampleNetwork);
      setupCreatorStub.copyChainJson.resolves(exampleNetworkFullName);

      await stateModel.prepareSetupFiles();
      expect(cryptoStub.getRandomPassword).to.have.been.calledOnceWith();
      expect(setupCreatorStub.createPasswordFile).to.have.been.calledOnceWith(examplePassword);
      expect(cryptoStub.getEncryptedWallet).to.have.been.calledOnceWith(examplePrivateKey, examplePassword);
      expect(setupCreatorStub.createKeyFile).to.have.been.calledOnceWith(exampleEncryptedWallet);
      expect(setupCreatorStub.copyChainJson).to.have.been.calledOnceWith(exampleNetwork.name);
      expect(setupCreatorStub.copyParityConfiguration).to.have.been.calledOnceWith('apollo', {address: exampleAddress, ip: exampleIP});
      expect(setupCreatorStub.prepareDockerComposeFile).to.have.been.calledOnceWith(
        'apollo', examplePrivateKey, exampleNetwork.rpc, exampleNetwork.headContractAddress, exampleNetworkFullName);
    });

    it('creates files for Hermes and Atlas', async () => {
      storeStub.safeRead.withArgs('role').resolves(HERMES)
        .withArgs('privateKey')
        .resolves(examplePrivateKey)
        .withArgs('network')
        .resolves(exampleNetwork);
      setupCreatorStub.copyChainJson.resolves(exampleNetworkFullName);

      await stateModel.prepareSetupFiles();
      expect(cryptoStub.getRandomPassword).to.have.not.been.called;
      expect(setupCreatorStub.createPasswordFile).to.have.not.been.called;
      expect(cryptoStub.getEncryptedWallet).to.have.not.been.called;
      expect(setupCreatorStub.createKeyFile).to.have.not.been.called;
      expect(setupCreatorStub.copyChainJson).to.have.been.calledOnceWith(exampleNetwork.name);
      expect(setupCreatorStub.copyParityConfiguration).to.have.been.calledOnceWith('hermes', {});
      expect(setupCreatorStub.prepareDockerComposeFile).to.have.been.calledOnceWith(
        'hermes', examplePrivateKey, exampleNetwork.rpc, exampleNetwork.headContractAddress, exampleNetworkFullName);
    });

    it('throws if invalid role provided', async () => {
      storeStub.safeRead.resolves(null);
      await expect(() => stateModel.prepareSetupFiles()).to.throw;
    });
  });
});
