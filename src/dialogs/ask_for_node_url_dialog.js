/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import inquirer from 'inquirer';
import chalk from 'chalk';

const askForNodeUrlDialog = (validations, messages) => async () => inquirer.prompt(
  [
    {
      type: 'input',
      name: 'nodeUrl',
      message: messages.nodeUrlInputInstruction,
      validate: (answer) => validations.isValidUrl(answer) || chalk.red(messages.nodeUrlInputError(chalk.yellow(answer))),
      transformer: (input) => {
        const prefixRegex = /^https?:\/\//g;
        if (input.match(prefixRegex) !== null) {
          return input;
        }
        return `(${chalk.red(messages.urlPrefixWarning)}) ${input}`;
      },
      filter: (answer) => {
        const suffixRegex = /(.+?)(\/+$)/g;
        const filteredAnswer = suffixRegex.exec(answer);
        if (filteredAnswer) {
          return filteredAnswer[1];
        }
        return answer;
      }
    }
  ]);

export default askForNodeUrlDialog;
