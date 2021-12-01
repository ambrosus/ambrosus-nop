/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import base64url from 'base64url';
import {ATLAS_1, ATLAS_2, ATLAS_3} from '../consts';
import StateModel from './state_model';
import Crypto from '../services/crypto';
import HttpUtils from '../utils/http_utils';

class AtlasModeModel {
  async getMode() {
    try {
      const role = await StateModel.getRole();
      const url = await StateModel.getNodeUrl();
      if (url && (role === ATLAS_1 || role === ATLAS_2 || role === ATLAS_3)) {
        const nodeInfo = await HttpUtils.httpGet(`${url}/nodeinfo`);
        const {mode} = nodeInfo;
        return mode;
      }
      return {};
    } catch (err) {
      return {};
    }
  }

  async setMode(mode) {
    try {
      const role = await StateModel.getRole();
      const url = await StateModel.getNodeUrl();
      if (url && (role === ATLAS_1 || role === ATLAS_2 || role === ATLAS_3)) {
        const token = await this.createSetModeToken(mode, 10);
        const request = `{"mode":"${token}"}`;
        return 200 === (await HttpUtils.httpPost(`${url}/nodeinfo`, request)).statusCode;
      }
      return false;
    } catch (err) {
      console.log('I/O error:', err);
      return false;
    }
  }

  async createSetModeToken(mode, accessPeriod, from = Date.now()) {
    const idData = {
      mode,
      createdBy: Crypto.address,
      validUntil: Math.floor(from / 1000) + accessPeriod
    };
    return base64url(this.serializeForHashing({
      signature: Crypto.account.sign(this.serializeForHashing(idData)).signature,
      idData
    }));
  }

  serializeForHashing(object) {
    const isDict = (subject) => typeof subject === 'object' && !Array.isArray(subject);
    const isString = (subject) => typeof subject === 'string';
    const isArray = (subject) => Array.isArray(subject);

    if (isDict(object)) {
      const content = Object.keys(object).sort()
        .map((key) => `"${key}":${this.serializeForHashing(object[key])}`)
        .join(',');
      return `{${content}}`;
    } else if (isArray(object)) {
      const content = object.map((item) => this.serializeForHashing(item)).join(',');
      return `[${content}]`;
    } else if (isString(object)) {
      return `"${object}"`;
    }
    return object.toString();
  }
}

export default new AtlasModeModel();
