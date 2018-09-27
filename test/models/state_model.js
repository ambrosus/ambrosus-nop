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
import {APOLLO} from '../../src/consts';

chai.use(chaiAsPromised);
chai.use(sinonChai);
const {expect} = chai;

describe('State Model', () => {
  let cryptoStub;
  let storeStub;
  let stateModel;

  const examplePrivateKey = '0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709';
  const exampleNetwork = 'amb-net';
  const exampleAddress = '0xB1D28124D5771dD347a0BDECbC72CFb2BFf4B2D7';
  const exampleRole = APOLLO;
  const exampleUrl = 'https://amb-node.com';
  const exampleEmail = 'amb_node_operator@mail.com';

  beforeEach(async () => {
    storeStub = {
      has: sinon.stub(),
      read: sinon.stub(),
      write: sinon.stub()
    };
    cryptoStub = {
      generatePrivateKey: sinon.stub().resolves(examplePrivateKey),
      addressForPrivateKey: sinon.stub().withArgs(examplePrivateKey)
        .resolves(exampleAddress)
    };
    stateModel = new StateModel(storeStub, cryptoStub);
  });

  describe('getExistingNetwork', () => {
    beforeEach(async () => {
      storeStub.read.resolves(exampleNetwork);
    });

    it('returns network if one exists', async () => {
      storeStub.has.resolves(true);
      expect(await stateModel.getExistingNetwork()).to.equal(exampleNetwork);
      expect(storeStub.has).to.have.been.calledOnceWith('network');
      expect(storeStub.read).to.have.been.calledOnceWith('network');
    });

    it('returns null if network is not stored', async () => {
      storeStub.has.resolves(false);
      expect(await stateModel.getExistingNetwork()).to.equal(null);
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

  describe('getExistingRole', () => {
    beforeEach(async () => {
      storeStub.read.resolves(exampleRole);
    });

    it('returns role if one exists', async () => {
      storeStub.has.resolves(true);
      expect(await stateModel.getExistingRole()).to.equal(exampleRole);
      expect(storeStub.has).to.have.been.calledOnceWith('role');
      expect(storeStub.read).to.have.been.calledOnceWith('role');
    });

    it('returns null if role does not exist yet', async () => {
      storeStub.has.resolves(false);
      expect(await stateModel.getExistingRole()).to.equal(null);
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

  describe('getExistingNodeUrl', () => {
    beforeEach(async () => {
      storeStub.read.resolves(exampleUrl);
    });

    it('returns node url if one exists', async () => {
      storeStub.has.resolves(true);
      expect(await stateModel.getExistingNodeUrl()).to.equal(exampleUrl);
      expect(storeStub.has).to.have.been.calledOnceWith('url');
      expect(storeStub.read).to.have.been.calledOnceWith('url');
    });

    it('returns null if node url does not exist yet', async () => {
      storeStub.has.resolves(false);
      expect(await stateModel.getExistingNodeUrl()).to.equal(null);
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

  describe('getExistingUserEmail', () => {
    beforeEach(async () => {
      storeStub.read.resolves(exampleEmail);
    });

    it('returns user email if one exists', async () => {
      storeStub.has.resolves(true);
      expect(await stateModel.getExistingUserEmail()).to.equal(exampleEmail);
      expect(storeStub.has).to.have.been.calledOnceWith('email');
      expect(storeStub.read).to.have.been.calledOnceWith('email');
    });

    it('returns null if user email does not exist yet', async () => {
      storeStub.has.resolves(false);
      expect(await stateModel.getExistingUserEmail()).to.equal(null);
      expect(storeStub.has).to.have.been.calledOnceWith('email');
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
});
