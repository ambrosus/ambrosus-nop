/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import Dialog from '../../src/models/dialog_model';
import StateModel from '../../src/models/state_model';
import Crypto from '../../src/services/crypto';
import getPrivateKeyPhase from '../../src/phases/get_private_key_phase';

chai.use(chaiAsPromised);
chai.use(sinonChai);
const {expect} = chai;

describe('Get Private Key Phase', () => {
  const examplePrivateKey = '0x0123456701234567012345670123456701234567012345670123456701234567';
  const exampleAddress = '0x012345670123456701234567012345670123456701234567';
  let stateModelStub;
  let cryptoStub;
  let privateKeyDetectedDialogStub;
  let askForPrivateKeyDialogStub;

  const call = getPrivateKeyPhase;

  beforeEach(async () => {
    cryptoStub = {
      addressForPrivateKey: sinon.stub().resolves(exampleAddress)
    };
    Crypto.addressForPrivateKey = cryptoStub.addressForPrivateKey;

    stateModelStub = {
      getAddress: sinon.stub(),
      storeAddress: sinon.stub(),
      getPrivateKey: sinon.stub(),
      storePrivateKey: sinon.stub(),
      generateAndStoreNewPrivateKey: sinon.stub()
    };
    StateModel.getAddress = stateModelStub.getAddress;
    StateModel.storeAddress = stateModelStub.storeAddress;
    StateModel.getPrivateKey = stateModelStub.getPrivateKey;
    StateModel.storePrivateKey = stateModelStub.storePrivateKey;
    StateModel.generateAndStoreNewPrivateKey = stateModelStub.generateAndStoreNewPrivateKey;

    privateKeyDetectedDialogStub = sinon.stub().resolves();
    askForPrivateKeyDialogStub = sinon.stub();
    Dialog.privateKeyDetectedDialog = privateKeyDetectedDialogStub;
    Dialog.askForPrivateKeyDialog = askForPrivateKeyDialogStub;
  });

  it('ends if a private key is already in the store', async () => {
    stateModelStub.getPrivateKey.resolves(examplePrivateKey);

    const ret = await call();

    expect(stateModelStub.getPrivateKey).to.have.been.calledOnce;
    expect(askForPrivateKeyDialogStub).to.not.have.been.called;
    expect(cryptoStub.addressForPrivateKey).to.have.been.calledOnceWith(examplePrivateKey);
    expect(privateKeyDetectedDialogStub).to.have.been.calledOnceWith(exampleAddress);
    expect(ret).to.equal(examplePrivateKey);
  });

  it('generates and stores a new private key (generate option)', async () => {
    stateModelStub.getPrivateKey.resolves(null);
    askForPrivateKeyDialogStub.resolves({
      source: 'generate'
    });
    stateModelStub.generateAndStoreNewPrivateKey.resolves(examplePrivateKey);

    const ret = await call();

    expect(stateModelStub.getPrivateKey).to.have.been.calledOnce;
    expect(askForPrivateKeyDialogStub).to.have.been.calledOnce;
    expect(stateModelStub.generateAndStoreNewPrivateKey).to.have.been.calledOnce;
    expect(cryptoStub.addressForPrivateKey).to.have.been.calledOnceWith(examplePrivateKey);
    expect(privateKeyDetectedDialogStub).to.have.been.calledOnceWith(exampleAddress);
    expect(ret).to.equal(examplePrivateKey);
  });

  it('stores the provided private key (manual option)', async () => {
    stateModelStub.getPrivateKey.resolves(null);
    askForPrivateKeyDialogStub.resolves({
      source: 'manual',
      privateKey: examplePrivateKey
    });
    stateModelStub.storePrivateKey.resolves();

    const ret = await call();

    expect(stateModelStub.getPrivateKey).to.have.been.calledOnce;
    expect(askForPrivateKeyDialogStub).to.have.been.calledOnce;
    expect(stateModelStub.storePrivateKey).to.have.been.calledOnceWith(examplePrivateKey);
    expect(cryptoStub.addressForPrivateKey).to.have.been.calledOnceWith(examplePrivateKey);
    expect(privateKeyDetectedDialogStub).to.have.been.calledOnceWith(exampleAddress);
    expect(ret).to.equal(examplePrivateKey);
  });
});
