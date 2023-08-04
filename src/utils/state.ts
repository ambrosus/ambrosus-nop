/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import {checkFileExists} from './file';
import {STATE_PATH} from '../../config/config';
import State from '../interfaces/state';
import {writeFile} from 'fs/promises';


export async function readState(): Promise<State> {
  if (await checkFileExists(STATE_PATH)) {
    return await import(STATE_PATH);
  }
  return {
    network: null,
    privateKey: null,
    address: null,
    ip: null
  };
}

export async function writeState(state: State) {
  await writeFile(STATE_PATH, JSON.stringify(state, null, 2));
}
