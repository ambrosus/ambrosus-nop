/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import base64url from 'base64url';
import {ATLAS_1, ATLAS_2, ATLAS_3} from '../consts';

export default class AtlasModeModel {
  constructor(httpUtils, account, stateModel) {
    this.httpUtils = httpUtils;
    this.account = account;
    this.stateModel = stateModel;
  }

  async getMode() {
    try {
      const role = await this.stateModel.getRole();
      const url = await this.stateModel.getNodeUrl();
      if (url && (role === ATLAS_1 || role === ATLAS_2 || role === ATLAS_3)) {
        let nodeInfo;
        if (0 === url.indexOf('https')) {
          nodeInfo = await this.httpUtils.getJsonHttps(`${url}/nodeinfo`);
        } else {
          nodeInfo = await this.httpUtils.getJsonHttp(`${url}/nodeinfo`);
        }
        return nodeInfo.mode;
      }
      return {};
    } catch (err) {
      return {};
    }
  }

  async setMode(mode) {
    try {
      const role = await this.stateModel.getRole();
      const url = await this.stateModel.getNodeUrl();
      if (url && (role === ATLAS_1 || role === ATLAS_2 || role === ATLAS_3)) {
        const token = await this.createSetModeToken(mode, 10);
        const request = `{"mode":"${token}"}`;
        if (0 === url.indexOf('https')) {
          return 200 === (await this.httpUtils.httpsPost(`${url}/nodeinfo`, request)).statusCode;
        }
        return 200 === (await this.httpUtils.httpPost(`${url}/nodeinfo`, request)).statusCode;
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
      createdBy: this.account.address,
      validUntil: Math.floor(from / 1000) + accessPeriod
    };
    return base64url(this.serializeForHashing({
      signature: this.account.sign(this.serializeForHashing(idData)).signature,
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
