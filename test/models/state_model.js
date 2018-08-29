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

chai.use(chaiAsPromised);
chai.use(sinonChai);
const {expect} = chai;

describe('State Model', () => {
  let cryptoStub;
  let storeStub;
  let stateModel;

  const examplePrivateKey = '0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709';

  beforeEach(async () => {
    storeStub = {
      has: sinon.stub(),
      read: sinon.stub().resolves(examplePrivateKey),
      write: sinon.stub()
    };
    cryptoStub = {
      generatePrivateKey: sinon.stub().resolves(examplePrivateKey)
    };
    stateModel = new StateModel(storeStub, cryptoStub);
  });

  describe('getExistingPrivateKey', () => {
    it('returns private key if one exists', async () => {
      storeStub.has.resolves(true);
      expect(await stateModel.getExistingPrivateKey()).to.equal(examplePrivateKey);
      await expect(storeStub.has).to.have.been.calledOnce;
      await expect(storeStub.read).to.have.been.calledOnce;
    });

    it('returns null if private key does not exist yet', async () => {
      storeStub.has.resolves(false);
      expect(await stateModel.getExistingPrivateKey()).to.equal(null);
      await expect(storeStub.has).to.have.been.calledOnce;
      await expect(storeStub.read).to.have.been.not.been.called;
    });
  });

  describe('storePrivateKey', () => {
    it('stores private key', async () => {
      await expect(stateModel.storePrivateKey(examplePrivateKey)).to.be.eventually.fulfilled;
      await expect(storeStub.write).to.have.been.calledOnceWith('privateKey', examplePrivateKey);
    });
  });

  describe('generateAndStoreNewPrivateKey', () => {
    it('generates new private key', async () => {
      await expect(stateModel.generateAndStoreNewPrivateKey()).to.be.eventually.fulfilled;
      await expect(cryptoStub.generatePrivateKey).to.have.been.calledOnce;
    });

    it('stores newly generated private key', async () => {
      await expect(stateModel.generateAndStoreNewPrivateKey()).to.be.eventually.fulfilled;
      await expect(storeStub.write).to.have.been.calledOnceWith('privateKey', examplePrivateKey);
    });
  });
});
