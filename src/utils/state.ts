/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import {STATE_PATH} from '../../config/config';
import State from '../interfaces/state';
import {readFile, writeFile} from 'fs/promises';
import {ensureDirectoryForFileExists} from './file';


export async function readState(): Promise<State> {
  try {
    const file = readFile(STATE_PATH, {encoding: 'utf8'});
    return JSON.parse(await file);
  } catch (e) {
    return {
      network: null,
      privateKey: null,
      address: null,
      ip: null
    };
  }
}

export async function writeState(state: State) {
  await ensureDirectoryForFileExists(STATE_PATH);
  await writeFile(STATE_PATH, JSON.stringify(state, null, 2));
}
