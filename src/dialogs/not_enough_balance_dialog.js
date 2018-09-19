/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import chalk from 'chalk';
import utils from '../utils/web3_utils';

const notEnoughBalanceDialog = (messages) => (requiredBalance) => {
  const requiredBalanceInAmb = utils.fromWei(requiredBalance, 'ether');
  console.log(chalk.red(messages.notEnoughBalance(chalk.yellow(`${requiredBalanceInAmb} ${messages.unitAmb}`))));
};

export default notEnoughBalanceDialog;


