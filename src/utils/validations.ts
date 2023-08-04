/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import ipRegex from 'ip-regex';

export function isValidPrivateKey(candidate) {
  const addressRegex = /^0x[0-9a-f]{64}$/i;
  return addressRegex.exec(candidate) !== null;
}

export function isValidIP(candidate) {
  return ipRegex({exact: true})
    .test(candidate);
}
