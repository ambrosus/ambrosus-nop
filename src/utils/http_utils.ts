/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import * as http from 'http';
import * as https from 'https';

export default class HttpUtils {
  async httpPost(url, data) {
    return new Promise((resolve, reject) => {
      const req = http.request(url,
        {method: 'POST', headers: {'Content-Type': 'application/json'}}, (res) => {
          const result: any = {data: ''};
          res.setEncoding('utf8');
          res.on('data', (chunk) => {
            result.data += chunk;
          });
          res.on('end', () => {
            if (res.statusCode === 200 || res.statusCode === 201) {
              result.statusCode = res.statusCode;
              resolve(result);
            } else {
              reject(res.statusCode);
            }
          });
        });
      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }

  async httpsPost(url, data) {
    return new Promise((resolve, reject) => {
      const req = https.request(url,
        {method: 'POST', headers: {'Content-Type': 'application/json'}}, (res) => {
          const result: any = {data: ''};
          res.setEncoding('utf8');
          res.on('data', (chunk) => {
            result.data += chunk;
          });
          res.on('end', () => {
            if (res.statusCode === 200 || res.statusCode === 201) {
              result.statusCode = res.statusCode;
              resolve(result);
            } else {
              reject(res.statusCode);
            }
          });
        });
      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }

  async getJsonHttp(url) {
    return new Promise((resolve, reject) => {
      const req = http.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(err);
          }
        });
      });
      req.on('error', reject);
      req.end();
    });
  }

  async getJsonHttps(url) {
    return new Promise((resolve, reject) => {
      const req = https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(err);
          }
        });
      });
      req.on('error', reject);
      req.end();
    });
  }
}
