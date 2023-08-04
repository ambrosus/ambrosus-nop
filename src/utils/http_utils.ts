/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import {createWriteStream} from 'fs';
import {isValidIP} from './validations';
import axios from 'axios';


export async function getMyIP() {
  const response = await axios.get('https://api.ipify.org//');
  if (response.status !== 200) {
    return null;
  }
  if (!isValidIP(response.data)) {
    return null;
  }
  return response.data;
}

export async function fileDownload(url, outputFilePath) {
  const response = await axios.get(url, {responseType: 'stream'});
  response.data.pipe(createWriteStream(outputFilePath));
  await new Promise((resolve, reject) => {
    response.data.on('end', () => resolve(null));
    response.data.on('error', (error: Error) => reject(error));
  });
}
