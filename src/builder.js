/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import Crypto from './services/crypto';
import Store from './services/store';
import Web3 from 'web3';

class Builder {
  async build(config) {
    const objects = {};
    objects.config = config;
    objects.web3 = new Web3();
    objects.store = new Store(config.storePath);
    objects.crypto = new Crypto(objects.web3);
    this.objects = objects;
    return objects;
  }
}

export default Builder;
