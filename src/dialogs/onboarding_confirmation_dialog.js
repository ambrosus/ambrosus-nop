/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import chalk from 'chalk';
import inquirer from 'inquirer';
import utils from '../utils/web3_utils';

const onboardingConfirmationDialog = (messages) => async (address, role, deposit) => {
  const depositInAmb = utils.fromWei(deposit, 'ether');
  console.log(chalk.green(messages.onboardingInfo(chalk.yellow(address), chalk.yellow(role), chalk.red(messages.onboardingWarning(chalk.yellow(`${depositInAmb} ${messages.unitAmb}`))))));
  return inquirer.prompt([
    {
      type: 'list',
      name: 'onboardingConfirmation',
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
};

export default onboardingConfirmationDialog;


