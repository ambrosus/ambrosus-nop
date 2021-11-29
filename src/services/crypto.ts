/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import Web3 from 'web3';
import {Account} from 'web3-core';

class Crypto {
  public web3: Web3;
  public account: Account;
  public address: string;

  constructor() {
    this.web3 = new Web3();
  }

  setProvider(rpc: string) {
    this.web3 = new Web3(rpc);
  }

  setAccount(privateKey) {
    this.account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
    this.web3.eth.accounts.wallet.add(this.account);
    const {address} = this.account;
    this.address = address;
    this.web3.eth.defaultAccount = address;
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

  getRandomPassword() {
    return this.web3.utils.randomHex(32);
  }

  sign(data, privateKey) {
    return this.web3.eth.accounts.sign(data, privateKey);
  }

  hashData(data) {
    return this.web3.utils.sha3(data);
  }
}

export default new Crypto();
