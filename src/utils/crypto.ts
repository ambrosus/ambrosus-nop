/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import Web3 from 'web3';

class Crypto {
  public web3: Web3;

  constructor() {
    this.web3 = new Web3();
  }

  generatePrivateKey() {
    return this.web3.eth.accounts.create().privateKey;
  }

  addressForPrivateKey(privateKey) {
    return this.web3.eth.accounts.privateKeyToAccount(privateKey).address;
  }

  getEncryptedWallet(privateKey, password) {
    return this.web3.eth.accounts.encrypt(privateKey, password);
  }

  getRandomPassword() {
    return this.web3.utils.randomHex(32);
  }
}

export default new Crypto();
