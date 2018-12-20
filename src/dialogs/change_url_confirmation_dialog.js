/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import chalk from 'chalk';
import inquirer from 'inquirer';

const changeUrlConfirmationDialog = (messages) => async (oldUrl, newUrl) => {
  console.log(chalk.green(messages.changeUrlInfo(chalk.yellow(oldUrl), chalk.yellow(newUrl), chalk.red(messages.changeUrlWarning))));
  const {confirmation} = await inquirer.prompt([
    {
      type: 'list',
      name: 'confirmation',
      message: messages.continueConfirmation,
      choices: [
        {
          name: messages.no,
          value: false
        },
        {
          name: messages.yes,
          value: true
        }
      ]
    }
  ]);
  return confirmation;
};

export default changeUrlConfirmationDialog;
