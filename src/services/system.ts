/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import {exec} from 'child_process';

class System {
  async isDockerAvailable() {
    try {
      const {stdout} = await this.execCmd('docker -v');
      const regex = /^Docker version ([0-9.\-a-z]+), build ([0-9a-f]+)/;
      return regex.exec(stdout) !== null;
    } catch ({err}) {
      return false;
    }
  }

  async execCmd(cmd): Promise<any> {
    return new Promise((resolve, reject) => {
      exec(cmd, (err, stdout, stderr) => {
        if (err === null) {
          resolve({stdout, stderr});
        } else {
          reject(err);
        }
      });
    });
  }
}

export default new System();
