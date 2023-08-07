/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/
import {exec, ExecOptions} from 'child_process';
import {OUTPUT_DIRECTORY} from '../../config/config';


export async function isDockerAvailable() {
  // todo ask "docker info" to check if docker daemon is running
  try {
    const {stdout} = await execCmd('docker -v');
    const regex = /^Docker version ([0-9.\-a-z]+), build ([0-9a-f]+)/;
    return regex.exec(stdout) !== null;
  } catch ({err}) {
    return false;
  }
}

export async function runDocker() {
  await execCmd('docker-compose up -d', {cwd: OUTPUT_DIRECTORY});
}

async function execCmd(cmd, options?: ExecOptions): Promise<any> {
  return new Promise((resolve, reject) => {
    exec(cmd, options, (err, stdout, stderr) => {
      if (err === null) {
        resolve({stdout, stderr});
      } else {
        reject(err);
      }
    });
  });
}
