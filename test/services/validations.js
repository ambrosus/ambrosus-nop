/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

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
      notHex: '0x074976a8D5Y07dA5XADa1Eb248AD369a764bB373DADa1Eb248AD369a764bB37Z',
      zeroed: '0x0000000000000000000000000000000000000000000000000000000000000000'
    };

    it('returns true for valid private key', async () => {
      expect(validations.isValidPrivateKey(inputs.correct)).to.be.true;
    });

    it('returns false if private key has wrong length', async () => {
      expect(validations.isValidPrivateKey(inputs.tooShort)).to.be.false;
      expect(validations.isValidPrivateKey(inputs.tooLong)).to.be.false;
    });

    it('returns false if private key has no 0x prefix', async () => {
      expect(validations.isValidPrivateKey(inputs.noPrefix)).to.be.false;
    });

    it('returns false if private key is not a hex value', async () => {
      expect(validations.isValidPrivateKey(inputs.notHex)).to.be.false;
    });

    it('returns false if private key has only zeroes', async () => {
      expect(validations.isValidPrivateKey(inputs.zeroed)).to.be.false;
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
        expect(validations.isValidUrl(url)).to.be.true;
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
        expect(validations.isValidUrl(url)).to.be.false;
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
        expect(validations.isValidEmail(email)).to.be.true;
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
        expect(validations.isValidEmail(email)).to.be.false;
      });
    });
  });

  describe('isValidIP', () => {
    const valid = [
      '10.0.0.1',
      '192.168.0.1',
      '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
      '2001:db8:85a3:0:0:8a2e:370:7334',
      '2001:db8:85a3::8a2e:370:7334'
    ];

    const invalid = [
      '10.0.0',
      '10.0.0.1.2',
      '300.0.0.1',
      '2001::8a2e::0370:7334',
      'prefix10.0.0.1',
      'prefix 10.0.0.1',
      '10.0.0.1sufix',
      '10.0.0.1 sufix'
    ];

    valid.forEach((validExample) =>
      it(`accepts ${validExample}`, () => {
        expect(validations.isValidIP(validExample)).to.be.true;
      })
    );

    invalid.forEach((invalidExample) =>
      it(`rejects ${invalidExample}`, () => {
        expect(validations.isValidIP(invalidExample)).to.be.false;
      })
    );
  });

  describe('isValidNumber', () => {
    const valid = [
      '0',
      '5',
      '123123',
      '3.14',
      '1e10',
      '-123'
    ];

    const invalid = [
      '',
      'test',
      '1a',
      'a1'
    ];

    valid.forEach((validExample) =>
      it(`accepts ${validExample}`, () => {
        expect(validations.isValidNumber(validExample)).to.be.true;
      })
    );

    invalid.forEach((invalidExample) =>
      it(`rejects ${invalidExample}`, () => {
        expect(validations.isValidNumber(invalidExample)).to.be.false;
      })
    );
  });
});
