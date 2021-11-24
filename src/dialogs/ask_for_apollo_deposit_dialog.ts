/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import inquirer from 'inquirer';
import chalk from 'chalk';
import * as utils from 'web3-utils';

const askForApolloDepositDialog = (validations, messages) => async (minimalDeposit) => {
  const minimalDepositBn = utils.toBN(minimalDeposit);
  const minimalDepositInAmb = utils.fromWei(minimalDeposit, 'ether');
  const {deposit} = await inquirer.prompt(
    [
      {
        type: 'input',
        name: 'deposit',
        message: messages.apolloDepositInputInstruction(chalk.yellow(minimalDepositInAmb)),
        validate: (answer) => {
          if (!validations.isValidNumber(answer)) {
            return chalk.red(messages.depositNumberError(chalk.yellow(answer)));
          }
          if (utils.toBN(+utils.toWei(answer, 'ether')).lt(minimalDepositBn)) {
            return chalk.red(messages.depositTooSmallError(chalk.yellow(minimalDepositInAmb), chalk.yellow(answer)));
          }
          return true;
        }
      }
    ]);
  return utils.toWei(deposit, 'ether').toString();
};

export default askForApolloDepositDialog;
