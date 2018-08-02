/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import Store from '../../src/services/store';
import {readFile, writeFile, removeFile} from '../../src/utils/file';

chai.use(chaiAsPromised);
const {expect} = chai;

describe('Store', () => {
  const testFile = './testStore.json';
  let store;

  before(async () => {
    store = new Store(testFile);
  });

  afterEach(async () => {
    await removeFile(testFile);
  });

  describe('writing', () => {
    it('writes the value under the key in the file', async () => {
      const testKey = 'abc';
      const testValue = '12345';

      await expect(store.write(testKey, testValue)).to.be.eventually.fulfilled;
      const fileContents = JSON.parse(await readFile(testFile));
      expect(fileContents[testKey]).to.be.equal(testValue);
    });

    it('override the value with the key in the file with the new value', async () => {
      const testKey = 'abc';
      const testValue1 = '12345';
      const testValue2 = '6421';

      await expect(store.write(testKey, testValue1)).to.be.eventually.fulfilled;
      await expect(store.write(testKey, testValue2)).to.be.eventually.fulfilled;
      const fileContents = JSON.parse(await readFile(testFile));
      expect(fileContents[testKey]).to.be.equal(testValue2);
    });

    it(`doesn't change other values`, async () => {
      const testKey1 = 'abc';
      const testKey2 = 'xyz';
      const testValue1 = '12345';
      const testValue2 = '6421';

      await store.write(testKey1, testValue1);
      await store.write(testKey2, testValue2);
      const fileContents = JSON.parse(await readFile(testFile));
      expect(fileContents[testKey1]).to.be.equal(testValue1);
      expect(fileContents[testKey2]).to.be.equal(testValue2);
    });
  });

  describe('reading', () => {
    beforeEach(async () => {
      await writeFile(testFile,
        JSON.stringify({
          oneTwoThree: 'test'
        }),
        null,
        2);
    });

    it('returns the value stored under key in the file', async () => {
      await expect(store.read(`oneTwoThree`)).to.eventually.be.fulfilled.and.equal('test');
    });

    it('throws if requested key is not found in the file', async () => {
      await expect(store.read(`otherKey`)).to.eventually.be.rejected;
    });
  });
});
