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

import getPrivateKeyPhase from '../../src/phases/get_private_key_phase';

chai.use(chaiAsPromised);
chai.use(sinonChai);
const {expect} = chai;

describe('Get Private Key Phase', () => {
  const examplePrivateKey = '0x0123456701234567012345670123456701234567012345670123456701234567';
  const exampleAddress = '0x012345670123456701234567012345670123456701234567';
  const examplePassphrase = '123';
  let stateModelStub;
  let cryptoStub;
  let privateKeyDetectedDialogStub;
  let askForPrivateKeyDialogStub;
  let askForPassphraseDialogStub;
  let askForPassphraseUnlockDialogStub;

  const call = async () => getPrivateKeyPhase(stateModelStub, cryptoStub, privateKeyDetectedDialogStub, askForPrivateKeyDialogStub, askForPassphraseDialogStub, askForPassphraseUnlockDialogStub)();

  beforeEach(async () => {
    cryptoStub = {
      addressForPrivateKey: sinon.stub().resolves(exampleAddress)
    };
    stateModelStub = {
      privateKey: examplePrivateKey,
      getAddress: sinon.stub(),
      getEncryptedWallet: sinon.stub(),
      storeNewEncryptedWallet: sinon.stub(),
      storeAddress: sinon.stub(),
      decryptWallet: sinon.stub()
    };
    privateKeyDetectedDialogStub = sinon.stub().resolves();
    askForPrivateKeyDialogStub = sinon.stub();
    askForPassphraseDialogStub = sinon.stub();
    askForPassphraseUnlockDialogStub = sinon.stub().resolves(examplePassphrase);
  });

  it('ends if a private key is already in the store', async () => {
    stateModelStub.getEncryptedWallet.resolves();

    const ret = await call();

    expect(stateModelStub.getEncryptedWallet).to.have.been.calledOnce;
    expect(askForPrivateKeyDialogStub).to.not.have.been.called;
    expect(askForPassphraseUnlockDialogStub).to.have.been.called;
    expect(cryptoStub.addressForPrivateKey).to.have.been.calledOnceWith(examplePrivateKey);
    expect(privateKeyDetectedDialogStub).to.have.been.calledOnceWith(exampleAddress);
    expect(ret).to.equal(examplePrivateKey);
  });

  it('generates and stores a new private key (generate option)', async () => {
    stateModelStub.getEncryptedWallet.resolves(null);
    askForPrivateKeyDialogStub.resolves({
      source: 'generate'
    });
    askForPassphraseDialogStub.resolves({
      passphraseType: 'manual',
      passphrase: examplePassphrase
    });
    stateModelStub.storeNewEncryptedWallet.resolves();

    const ret = await call();

    expect(stateModelStub.getEncryptedWallet).to.have.been.calledOnce;
    expect(askForPrivateKeyDialogStub).to.have.been.calledOnce;
    expect(stateModelStub.storeNewEncryptedWallet).to.have.been.calledOnce;
    expect(cryptoStub.addressForPrivateKey).to.have.been.calledOnceWith(examplePrivateKey);
    expect(privateKeyDetectedDialogStub).to.have.been.calledOnceWith(exampleAddress);
    expect(ret).to.equal(examplePrivateKey);
  });

  it('stores the provided private key (manual option)', async () => {
    stateModelStub.getEncryptedWallet.resolves(null);
    askForPrivateKeyDialogStub.resolves({
      source: 'manual',
      privateKey: examplePrivateKey
    });
    askForPassphraseDialogStub.resolves({
      passphraseType: 'manual',
      passphrase: examplePassphrase
    });

    const ret = await call();

    expect(stateModelStub.getEncryptedWallet).to.have.been.calledOnce;
    expect(askForPrivateKeyDialogStub).to.have.been.calledOnce;
    expect(stateModelStub.storeAddress).to.have.been.calledOnceWith(exampleAddress);
    expect(cryptoStub.addressForPrivateKey).to.have.been.calledOnceWith(examplePrivateKey);
    expect(privateKeyDetectedDialogStub).to.have.been.calledOnceWith(exampleAddress);
    expect(ret).to.equal(examplePrivateKey);
  });
});
