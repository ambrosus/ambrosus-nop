/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import https from 'https';
import fs from 'fs';

const makeRequest = async (url) => new Promise((resolve, reject) => {
  https.get(url, (response) => {
    if (response.statusCode !== 200) {
      reject(`Request to ${url} failed: ${response.statusCode}`);
    } else {
      resolve(response);
    }
  });
});

export default async (url, outputFilePath) => {
  const writeStream = fs.createWriteStream(outputFilePath);
  const response = await makeRequest(url);
  response.pipe(writeStream);
  return new Promise(((resolve, reject) => {
    writeStream.on('finish', () => {
      writeStream.close(resolve);
    });
    writeStream.on('error', reject);
  }));
};
