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
import Crypto from '../../src/services/crypto';

chai.use(chaiAsPromised);
chai.use(sinonChai);
const {expect} = chai;


describe('Crypto', () => {
  const exampleAddress = '0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01';
  const examplePrivateKey = '0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709';
  let crypto;
  let web3Stub;

  beforeEach(async () => {
    web3Stub = {
      eth: {
        accounts: {
          create: sinon.stub(),
          privateKeyToAccount: sinon.stub(),
          wallet: {
            encrypt: sinon.stub(),
            add: sinon.stub()
          }
        },
        getBalance: sinon.stub()
      },
      utils: {
        toBN: sinon.stub(),
        randomHex: sinon.stub()
      }
    };
    crypto = new Crypto(web3Stub);
  });

  describe('generatePrivateKey', () => {
    const call = async () => crypto.generatePrivateKey();

    it('delegates the generation to web3 internally', async () => {
      web3Stub.eth.accounts.create.returns({
        address: exampleAddress,
        privateKey: examplePrivateKey
      });

      const ret = await call();

      expect(web3Stub.eth.accounts.create).to.have.been.calledOnce;
      expect(ret).to.equal(examplePrivateKey);
    });
  });

  describe('addressForPrivateKey', () => {
    it('delegates the job to web3', async () => {
      web3Stub.eth.accounts.privateKeyToAccount.returns({
        address: '0x9876'
      });
      await expect(crypto.addressForPrivateKey('0x1234')).to.eventually.be.equal('0x9876');
      expect(web3Stub.eth.accounts.privateKeyToAccount).to.have.been.calledOnceWith('0x1234');
    });
  });

  describe('getBalance', () => {
    it('calls getBalance on web3', async () => {
      const balance = '123';
      const balanceBN = {value: 123};
      web3Stub.eth.getBalance.resolves(balance);
      web3Stub.utils.toBN.returns(balanceBN);

      expect(await crypto.getBalance(exampleAddress)).to.deep.equal(balanceBN);
      expect(web3Stub.eth.getBalance).to.be.calledOnceWith(exampleAddress);
      expect(web3Stub.utils.toBN).to.be.calledOnceWith(balance);
    });
  });

  describe('getEncryptedWallet', () => {
    const password = 'theFunniestPasswordICouldEverImagine';
    const privateKey = '0xdeadface';
    const encryptedWallet = [{value: 123}];
    const account = {foo: 'bar'};

    it('calls encrypt on web3', async () => {
      web3Stub.eth.accounts.wallet.encrypt.returns([encryptedWallet]);
      web3Stub.eth.accounts.privateKeyToAccount.returns(account);

      expect(await crypto.getEncryptedWallet(password, privateKey)).to.deep.equal(encryptedWallet);
      expect(web3Stub.eth.accounts.wallet.encrypt).to.be.calledOnceWith(password);
      expect(web3Stub.eth.accounts.privateKeyToAccount).to.be.calledOnceWith(privateKey);
      expect(web3Stub.eth.accounts.wallet.add).to.be.calledOnceWith(account);
    });
  });

  describe('getRandomPassword', () => {
    it('calls randomHex on web3', async () => {
      const randomHex = '0xdeadbeef';
      web3Stub.utils.randomHex.resolves(randomHex);

      expect(await crypto.getRandomPassword(exampleAddress)).to.deep.equal(randomHex);
      expect(web3Stub.utils.randomHex).to.be.calledOnceWith(32);
    });
  });
});
