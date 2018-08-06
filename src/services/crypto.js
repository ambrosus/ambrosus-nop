/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

class Crypto {
  constructor(web3) {
    this.web3 = web3;
  }

  async generatePrivateKey() {
    const account = this.web3.eth.accounts.create();
    return account.privateKey;
  }
}

export default Crypto;

