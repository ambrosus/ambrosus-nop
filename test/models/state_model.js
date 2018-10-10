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
  const exampleEmail = 'amb_node_operator@mail.com';
  const exampleNetwork = {
    rpc: 'localhost:8545',
    headContractAddress: '0x00000f10'
  };
  const examplePassword = 'randomBytes';
  const exampleEncryptedWallet = {foo: 'bar'};

  beforeEach(async () => {
    storeStub = {
      has: sinon.stub(),
      read: sinon.stub(),
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
      prepareDockerComposeFile: sinon.stub()
    };
    stateModel = new StateModel(storeStub, cryptoStub, setupCreatorStub);
  });

  describe('getNetwork', () => {
    beforeEach(async () => {
      storeStub.read.resolves(exampleNetwork);
    });

    it('returns network if one exists', async () => {
      storeStub.has.resolves(true);
      expect(await stateModel.getNetwork()).to.equal(exampleNetwork);
      expect(storeStub.has).to.have.been.calledOnceWith('network');
      expect(storeStub.read).to.have.been.calledOnceWith('network');
    });

    it('returns null if network is not stored', async () => {
      storeStub.has.resolves(false);
      expect(await stateModel.getNetwork()).to.equal(null);
      expect(storeStub.has).to.have.been.calledOnceWith('network');
      expect(storeStub.read).to.have.not.been.called;
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

  describe('getExistingPrivateKey', () => {
    beforeEach(async () => {
      storeStub.read.resolves(examplePrivateKey);
    });

    it('returns private key if one exists', async () => {
      storeStub.has.resolves(true);
      expect(await stateModel.getExistingPrivateKey()).to.equal(examplePrivateKey);
      expect(storeStub.has).to.have.been.calledOnceWith('privateKey');
      expect(storeStub.read).to.have.been.calledOnceWith('privateKey');
    });

    it('returns null if private key does not exist yet', async () => {
      storeStub.has.resolves(false);
      expect(await stateModel.getExistingPrivateKey()).to.equal(null);
      expect(storeStub.has).to.have.been.calledOnceWith('privateKey');
      expect(storeStub.read).to.have.not.been.called;
    });
  });

  describe('storePrivateKey', () => {
    it('stores private key', async () => {
      await expect(stateModel.storePrivateKey(examplePrivateKey)).to.be.eventually.fulfilled;
      expect(storeStub.write).to.have.been.calledOnceWith('privateKey', examplePrivateKey);
    });
  });

  describe('getExistingAddress', () => {
    beforeEach(async () => {
      storeStub.read.resolves(examplePrivateKey);
    });

    it('converts private key to address if one exists', async () => {
      storeStub.has.resolves(true);
      expect(await stateModel.getExistingAddress()).to.equal(exampleAddress);
      expect(storeStub.has).to.have.been.calledOnceWith('privateKey');
      expect(storeStub.read).to.have.been.calledOnceWith('privateKey');
      expect(cryptoStub.addressForPrivateKey).to.have.been.calledOnceWith(examplePrivateKey);
    });

    it('returns null if private key does not exist yet', async () => {
      storeStub.has.resolves(false);
      expect(await stateModel.getExistingAddress()).to.equal(null);
      expect(storeStub.has).to.have.been.calledOnceWith('privateKey');
      expect(storeStub.read).to.have.not.been.called;
    });
  });

  describe('getRole', () => {
    beforeEach(async () => {
      storeStub.read.resolves(exampleRole);
    });

    it('returns role if one exists', async () => {
      storeStub.has.resolves(true);
      expect(await stateModel.getRole()).to.equal(exampleRole);
      expect(storeStub.has).to.have.been.calledOnceWith('role');
      expect(storeStub.read).to.have.been.calledOnceWith('role');
    });

    it('returns null if role does not exist yet', async () => {
      storeStub.has.resolves(false);
      expect(await stateModel.getRole()).to.equal(null);
      expect(storeStub.has).to.have.been.calledOnceWith('role');
      expect(storeStub.read).to.have.not.been.called;
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
      storeStub.read.resolves(exampleUrl);
    });

    it('returns node url if one exists', async () => {
      storeStub.has.resolves(true);
      expect(await stateModel.getNodeUrl()).to.equal(exampleUrl);
      expect(storeStub.has).to.have.been.calledOnceWith('url');
      expect(storeStub.read).to.have.been.calledOnceWith('url');
    });

    it('returns null if node url does not exist yet', async () => {
      storeStub.has.resolves(false);
      expect(await stateModel.getNodeUrl()).to.equal(null);
      expect(storeStub.has).to.have.been.calledOnceWith('url');
      expect(storeStub.read).to.have.not.been.called;
    });
  });

  describe('storeNodeUrl', () => {
    it('stores url', async () => {
      await expect(stateModel.storeNodeUrl(exampleUrl)).to.be.eventually.fulfilled;
      expect(storeStub.write).to.have.been.calledOnceWith('url', exampleUrl);
    });
  });

  describe('getUserEmail', () => {
    beforeEach(async () => {
      storeStub.read.resolves(exampleEmail);
    });

    it('returns user email if one exists', async () => {
      storeStub.has.resolves(true);
      expect(await stateModel.getUserEmail()).to.equal(exampleEmail);
      expect(storeStub.has).to.have.been.calledOnceWith('email');
      expect(storeStub.read).to.have.been.calledOnceWith('email');
    });

    it('returns null if user email does not exist yet', async () => {
      storeStub.has.resolves(false);
      expect(await stateModel.getUserEmail()).to.equal(null);
      expect(storeStub.has).to.have.been.calledOnceWith('email');
      expect(storeStub.read).to.have.not.been.called;
    });
  });

  describe('web3RPCForNetwork', () => {
    beforeEach(async () => {
      storeStub.read.resolves(exampleNetwork);
    });

    it('returns network web3 rpc if one exists', async () => {
      storeStub.has.resolves(true);
      expect(await stateModel.web3RPCForNetwork()).to.equal(exampleNetwork.rpc);
      expect(storeStub.has).to.have.been.calledOnceWith('network');
      expect(storeStub.read).to.have.been.calledOnceWith('network');
    });

    it('returns null if network does not exist yet', async () => {
      storeStub.has.resolves(false);
      expect(await stateModel.web3RPCForNetwork()).to.equal(null);
      expect(storeStub.has).to.have.been.calledOnceWith('network');
      expect(storeStub.read).to.have.not.been.called;
    });
  });

  describe('headContractAddressForNetwork', () => {
    beforeEach(async () => {
      storeStub.read.resolves(exampleNetwork);
    });

    it('returns network head contract address if one exists', async () => {
      storeStub.has.resolves(true);
      expect(await stateModel.headContractAddressForNetwork()).to.equal(exampleNetwork.headContractAddress);
      expect(storeStub.has).to.have.been.calledOnceWith('network');
      expect(storeStub.read).to.have.been.calledOnceWith('network');
    });

    it('returns null if network does not exist yet', async () => {
      storeStub.has.resolves(false);
      expect(await stateModel.headContractAddressForNetwork()).to.equal(null);
      expect(storeStub.has).to.have.been.calledOnceWith('network');
      expect(storeStub.read).to.have.not.been.called;
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
      address: exampleAddress,
      role: exampleRole,
      url: exampleUrl,
      email: exampleEmail
    };

    beforeEach(async () => {
      storeStub.has.withArgs('privateKey').resolves(true);
      storeStub.has.withArgs('role').resolves(true);
      storeStub.has.withArgs('url').resolves(true);
      storeStub.has.withArgs('email').resolves(true);
      storeStub.read.withArgs('privateKey').resolves(examplePrivateKey);
      storeStub.read.withArgs('role').resolves(exampleRole);
      storeStub.read.withArgs('url').resolves(exampleUrl);
      storeStub.read.withArgs('email').resolves(exampleEmail);
    });
    it('assembles submission', async () => {
      expect(await stateModel.assembleSubmission()).to.deep.equal(assembledSubmission);
      expect(storeStub.has).to.have.callCount(4);
      expect(storeStub.read).to.have.callCount(4);
      expect(storeStub.has).to.have.been.calledWith('privateKey');
      expect(storeStub.has).to.have.been.calledWith('role');
      expect(storeStub.has).to.have.been.calledWith('url');
      expect(storeStub.has).to.have.been.calledWith('email');
      expect(storeStub.read).to.have.been.calledWith('privateKey');
      expect(storeStub.read).to.have.been.calledWith('role');
      expect(storeStub.read).to.have.been.calledWith('url');
      expect(storeStub.read).to.have.been.calledWith('email');
      expect(cryptoStub.addressForPrivateKey).to.have.been.calledOnceWith(examplePrivateKey);
    });
  });

  describe('prepareSetupFiles', async () => {
    it('creates all needed files for Apollo', async () => {
      storeStub.has.returns(true);
      storeStub.read.onCall(0).returns(APOLLO)
        .onCall(1)
        .returns(examplePrivateKey)
        .onCall(2)
        .returns(exampleNetwork)
        .onCall(3)
        .returns(exampleNetwork);
      await stateModel.prepareSetupFiles();
      expect(setupCreatorStub.copyParityConfiguration).to.have.been.calledOnce;
      expect(cryptoStub.getRandomPassword).to.have.been.calledOnce;
      expect(setupCreatorStub.createPasswordFile).to.have.been.calledOnceWith(examplePassword);
      expect(cryptoStub.getEncryptedWallet).to.have.been.calledOnceWith(examplePrivateKey, examplePassword);
      expect(setupCreatorStub.createKeyFile).to.have.been.calledOnceWith(exampleEncryptedWallet);
      expect(setupCreatorStub.prepareDockerComposeFile).to.have.been.calledOnce;
    });

    it('creates all needed files (but skips some) for non Apollo', async () => {
      storeStub.has.returns(true);
      storeStub.read.onCall(0).returns(HERMES)
        .onCall(1)
        .returns(examplePrivateKey)
        .onCall(2)
        .returns(exampleNetwork)
        .onCall(3)
        .returns(exampleNetwork);
      await stateModel.prepareSetupFiles();
      expect(setupCreatorStub.copyParityConfiguration).to.have.been.calledOnce;
      expect(cryptoStub.getRandomPassword).to.have.not.been.called;
      expect(setupCreatorStub.createPasswordFile).to.have.not.been.called;
      expect(cryptoStub.getEncryptedWallet).to.have.not.been.called;
      expect(setupCreatorStub.createKeyFile).to.have.not.been.called;
      expect(setupCreatorStub.prepareDockerComposeFile).to.have.been.calledOnce;
    });

    it('throws if invalid role provided', async () => {
      storeStub.has.returns(false);
      await expect(() => stateModel.prepareSetupFiles()).to.throw;
    });
  });
});
