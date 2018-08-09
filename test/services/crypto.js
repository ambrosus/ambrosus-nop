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
          create: sinon.stub()
        }
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

  describe('isValidPrivateKey', () => {
    const inputs = {
      correct: '0x074976a8D5F07dA5DADa1Eb248AD369a764bB373DADa1Eb248AD369a764bB373',
      tooShort: '0x074976a8D5F07dA5DADa1Eb248AD369a764bB373DADa1Eb248AD369a764b373',
      tooLong: '0x074976a8D5F07dA5DADa1Eb248AD369a764bB373DADa1Eb248AD369a764b37311',
      noPrefix: '074976a8D5F07dA5DADa1Eb248AD369a764bB373DADa1Eb248AD369a764bB373',
      notHex: '0x074976a8D5Y07dA5XADa1Eb248AD369a764bB373DADa1Eb248AD369a764bB37Z'
    };

    it('returns true for valid private key', async () => {
      await expect(crypto.isValidPrivateKey(inputs.correct)).to.eventually.be.true;
    });

    it('returns false if private key has wrong length', async () => {
      await expect(crypto.isValidPrivateKey(inputs.tooShort)).to.eventually.be.false;
      await expect(crypto.isValidPrivateKey(inputs.tooLong)).to.eventually.be.false;
    });

    it('returns false if private key has no 0x prefix', async () => {
      await expect(crypto.isValidPrivateKey(inputs.noPrefix)).to.eventually.be.false;
    });

    it('returns false if private key is not a hex value', async () => {
      await expect(crypto.isValidPrivateKey(inputs.notHex)).to.eventually.be.false;
    });
  });
});
