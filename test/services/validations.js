/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

import Validations from '../../src/services/validations';

chai.use(chaiAsPromised);
chai.use(sinonChai);
const {expect} = chai;


describe('Validations', () => {
  let validations;

  beforeEach(async () => {
    validations = new Validations();
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
      await expect(validations.isValidPrivateKey(inputs.correct)).to.eventually.be.true;
    });

    it('returns false if private key has wrong length', async () => {
      await expect(validations.isValidPrivateKey(inputs.tooShort)).to.eventually.be.false;
      await expect(validations.isValidPrivateKey(inputs.tooLong)).to.eventually.be.false;
    });

    it('returns false if private key has no 0x prefix', async () => {
      await expect(validations.isValidPrivateKey(inputs.noPrefix)).to.eventually.be.false;
    });

    it('returns false if private key is not a hex value', async () => {
      await expect(validations.isValidPrivateKey(inputs.notHex)).to.eventually.be.false;
    });
  });

  describe('isValidUrl', () => {
    const correctInputs = [
      'http://ambrosusnode.com',
      'http://ambrosus-node.com',
      'http://ambrosus-node.masternode.com',
      'http://ambrosus-node.com:8080',
      'https://ambrosus-node.com/api',
      'https://ambrosus-node.com/resources/ambnet/app.js'
    ];

    correctInputs.forEach((url) => {
      it(`returns true for ${url}`, async () => {
        await expect(validations.isValidUrl(url)).to.eventually.be.true;
      });
    });

    const incorrectInputs = [
      'http://ambrosus-node.123',
      'http://ambrosus-node.',
      'http://ambrosus-node',
      'ftp://ambrosus-node.com',
      '//ambrosus-node.com/resources/ambnet/accesspoint/app.js',
      'ambrosus-node.com',
      'ambrosus-node'
    ];

    incorrectInputs.forEach((url) => {
      it(`returns false for ${url}`, async () => {
        await expect(validations.isValidUrl(url)).to.eventually.be.false;
      });
    });
  });

  describe('isValidEmail', () => {
    const correctInputs = [
      'amboperator@gmail.com',
      'amb_operator@mail.com',
      'amb.operator@poczta.pl',
      'amb.perator@gmail.subdomain.com',
      'amb-operator@gmail.com',
      '123456@gmail.com',
      '"amboperator"@gmail.com',
      'amboperator@subdomain.gmail.com',
      'amboperator@gmail.name'
    ];

    correctInputs.forEach((email) => {
      it(`returns true for ${email}`, async () => {
        await expect(validations.isValidEmail(email)).to.eventually.be.true;
      });
    });

    const incorrectInputs = [
      'amboperator',
      '#@%^%#$@#$@#.com',
      '@gmail.com',
      'amb operator@gmail.com',
      'amboperator.gmail.com',
      'amboperator@gmail@gmail.com',
      '.amboperator@gmail.com',
      'amboperator.@gmail.com',
      'amboperator@gmail..com',
      'amboperator@gmail.com (John Smith)',
      'amboperator@gmail',
      'amb..operator@gmail.com'
    ];

    incorrectInputs.forEach((email) => {
      it(`returns false for ${email}`, async () => {
        await expect(validations.isValidEmail(email)).to.eventually.be.false;
      });
    });
  });
});
