/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import inquirer from 'inquirer';
import chalk from 'chalk';

const continueAtlasRetirementDialog = (messages) => async () => inquirer.prompt([
  {
    type: 'list',
    name: 'continueConfirmation',
    message: chalk.yellow(chalk.bold(messages.continueAtlasRetirement)),
    choices: [
      {
        name: messages.continue,
        value: true
      },
      {
        name: messages.no,
        value: false
      }
    ]
  }
]);

export default continueAtlasRetirementDialog;
