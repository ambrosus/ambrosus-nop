/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import inquirer from 'inquirer';
import chalk from 'chalk';

const MINIMAL_DEPOSIT = 1000000;

const askForApolloMinimalDepositDialog = (validations, messages) => async () => {
  const {deposit} = await inquirer.prompt(
    [
      {
        type: 'input',
        name: 'deposit',
        message: messages.apolloMinimalDepositInputInstruction,
        validate: (answer) => {
          if (!validations.isValidNumber(answer)) {
            return chalk.red(messages.depositNumberError(chalk.yellow(answer)));
          }
          if (parseInt(answer, 10) < MINIMAL_DEPOSIT) {
            return chalk.red(messages.depositTooSmallError(chalk.yellow(MINIMAL_DEPOSIT), chalk.yellow(answer)));
          }
          return true;
        }
      }
    ]);
  return deposit;
};

export default askForApolloMinimalDepositDialog;
