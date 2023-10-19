/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import ipRegex from 'ip-regex';
import psl from 'psl';
import {URL} from 'url';

class Validations {
  isValidPrivateKey(candidate) {
    const addressRegex = /^0x[0-9a-f]{64}$/i;
    return addressRegex.exec(candidate) !== null;
  }

  isValidUrl = (inputUrl) => {
    try {
      const stringUrl = inputUrl.toString();
      const url = new URL(stringUrl);
      const {protocol, hostname} = url;
      if (!(['http:', 'https:'].includes(protocol))) {
        return false;
      }
      if (!psl.isValid(hostname)) {
        const ipv4 = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (!ipv4.test(hostname)) {
          return false;
        }
      }
      return true;
      // eslint-disable-next-line no-empty
    } catch {}
    return false;
  };

  isValidEmail(candidate) {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.exec(candidate) !== null;
  }

  isValidIP(candidate) {
    return ipRegex({exact: true}).test(candidate);
  }

  isValidNumber(candidate) {
    return candidate.length > 0 && !isNaN(candidate);
  }

  isValidTosConfirmation(confirmation) {
    const tosConfirmationRegex = /^I, .+, read and agreed with the terms and conditions above\.$/;
    return tosConfirmationRegex.exec(confirmation) !== null;
  }
}

export default new Validations();
