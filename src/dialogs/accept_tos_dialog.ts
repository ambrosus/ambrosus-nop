/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import chalk from 'chalk';
import inquirer from 'inquirer';

const acceptTosDialog = (validations, messages) => async (tosText) => {
  console.log(chalk.red(messages.acceptTos));
  console.log(tosText);
  return inquirer.prompt(
    [
      {
        type: 'input',
        name: 'acceptanceSentence',
        message: messages.tosConfirmationInputInstruction,
        validate: (answer) => validations.isValidTosConfirmation(answer) || chalk.red(messages.tosConfirmationInputError(chalk.yellow(answer)))
      }
    ]);
};

export default acceptTosDialog;
