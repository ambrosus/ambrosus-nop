/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import chalk from 'chalk';
import {APOLLO, HERMES, ATLAS_1, ATLAS_2, ATLAS_3} from '../consts';

const roleChosenDialog = () => async (role) => {
  const roleName = getRoleName(role);
  console.log(chalk.green('Role has been correctly chosen. Selected role: ') + chalk.yellow(roleName));
};

const getRoleName = (role) => {
  if (role === APOLLO) {
    return 'Apollo';
  }
  if (role === HERMES) {
    return 'Hermes';
  }
  if (role === ATLAS_1) {
    return 'Atlas Zeta';
  }
  if (role === ATLAS_2) {
    return 'Atlas Sigma';
  }
  if (role === ATLAS_3) {
    return 'Atlas Omega';
  }
};

export default roleChosenDialog;
