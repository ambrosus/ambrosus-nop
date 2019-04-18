/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import inquirer from 'inquirer';
import chalk from 'chalk';

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
          return true;
        }
      }
    ]);
  return deposit;
};

export default askForApolloMinimalDepositDialog;
