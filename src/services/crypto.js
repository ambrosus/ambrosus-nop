/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import * as crypto from 'crypto';

export default class Crypto {
  constructor(web3) {
    this.web3 = web3;
  }

  async generatePrivateKey() {
    const account = this.web3.eth.accounts.create();
    return account.privateKey;
  }

  async addressForPrivateKey(privateKey) {
    const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
    return account.address;
  }

  async getBalance(address) {
    return this.web3.utils.toBN(await this.web3.eth.getBalance(address));
  }

  getEncryptedWallet(privateKey, password) {
    return this.web3.eth.accounts.encrypt(privateKey, password);
  }

  getDecryptedWallet(encryptedWallet, password) {
    return this.web3.eth.accounts.decrypt(encryptedWallet, password);
  }

  getRandomPassword() {
    return this.web3.utils.randomHex(32);
  }

  sign(data, privateKey) {
    return this.web3.eth.accounts.sign(data, privateKey);
  }

  hashData(data) {
    return this.web3.utils.sha3(data);
  }

  md5(data) {
    return crypto.createHash('md5').update(data)
      .digest();
  }

  sha256(data) {
    return crypto.createHash('sha256').update(data)
      .digest();
  }

  aesEncrypt(input, key) {
    const iv = this.md5(key);
    const enc = this.sha256(key);
    const cipher = crypto.createCipheriv('aes-256-cbc', enc, iv);

    const encrypted = Buffer.concat([cipher.update(input), cipher.final()]);
    return `${encrypted.toString('hex')}`;
  }

  aesDecrypt(input, key) {
    const iv = this.md5(key);
    const enc = this.sha256(key);
    const decipher = crypto.createDecipheriv('aes-256-cbc', enc, iv);

    const encrypted = Buffer.concat([decipher.update(Buffer.from(input, 'hex')), decipher.final()]);
    return `${encrypted.toString()}`;
  }
}
