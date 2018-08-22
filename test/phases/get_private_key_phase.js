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

import getPrivateKeyPhase from '../../src/phases/get_private_key_phase';

chai.use(chaiAsPromised);
chai.use(sinonChai);
const {expect} = chai;

describe('Get Private Key Phase', () => {
  const examplePrivateKey = '0x0123456701234567012345670123456701234567012345670123456701234567';
  let storeStub;
  let privateKeyDetectedDialogStub;
  let askForPrivateKeyDialogStub;
  let cryptoStub;

  const call = async () => getPrivateKeyPhase(storeStub, cryptoStub, privateKeyDetectedDialogStub, askForPrivateKeyDialogStub)();

  beforeEach(async () => {
    storeStub = {
      has: sinon.stub(),
      read: sinon.stub(),
      write: sinon.stub()
    };
    privateKeyDetectedDialogStub = sinon.stub().resolves();
    askForPrivateKeyDialogStub = sinon.stub();
    cryptoStub = {
      generatePrivateKey: sinon.stub()
    };
  });

  it('ends if a private key is already in the store', async () => {
    storeStub.has.withArgs('privateKey').resolves(true);
    storeStub.read.withArgs('privateKey').resolves(examplePrivateKey);

    const ret = await call();

    expect(storeStub.has).to.have.been.calledOnceWith('privateKey');
    expect(storeStub.read).to.have.been.calledOnceWith('privateKey');
    expect(askForPrivateKeyDialogStub).to.not.have.been.called;
    expect(privateKeyDetectedDialogStub).to.have.been.calledOnceWith(examplePrivateKey);
    expect(ret).to.equal(examplePrivateKey);
  });

  it('generates and stores a new private key (generate option)', async () => {
    storeStub.has.withArgs('privateKey').resolves(false);
    askForPrivateKeyDialogStub.resolves({
      source: 'generate'
    });
    cryptoStub.generatePrivateKey.resolves(examplePrivateKey);
    storeStub.write.resolves();

    const ret = await call();

    expect(storeStub.has).to.have.been.calledOnceWith('privateKey');
    expect(storeStub.read).to.not.have.been.called;
    expect(askForPrivateKeyDialogStub).to.have.been.calledOnce;
    expect(cryptoStub.generatePrivateKey).to.have.been.calledOnce;
    expect(storeStub.write).to.have.been.calledOnceWith('privateKey', examplePrivateKey);
    expect(privateKeyDetectedDialogStub).to.have.been.calledOnceWith(examplePrivateKey);
    expect(ret).to.equal(examplePrivateKey);
  });

  it('stores the provided private key (manual option)', async () => {
    storeStub.has.withArgs('privateKey').resolves(false);
    askForPrivateKeyDialogStub.resolves({
      source: 'manual',
      privateKey: examplePrivateKey
    });
    storeStub.write.resolves();

    const ret = await call();

    expect(storeStub.has).to.have.been.calledOnceWith('privateKey');
    expect(storeStub.read).to.not.have.been.called;
    expect(askForPrivateKeyDialogStub).to.have.been.calledOnce;
    expect(cryptoStub.generatePrivateKey).to.not.have.been.called;
    expect(storeStub.write).to.have.been.calledOnceWith('privateKey', examplePrivateKey);
    expect(privateKeyDetectedDialogStub).to.have.been.calledOnceWith(examplePrivateKey);
    expect(ret).to.equal(examplePrivateKey);
  });
});
