/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import inquirer from 'inquirer';
import chalk from 'chalk';

const askForPrivateKeyDialog = (validations, messages) => async () => inquirer.prompt(
  [
    {
      type: 'list',
      name: 'source',
      message: messages.noPrivateKeyQuestion,
      choices: [
        {
          name: messages.privateKeyManualInputAnswer,
          value: 'manual'
        },
        {
          name: messages.privateKeyAutoGenerationAnswer,
          value: 'generate'
        }
      ]
    },
    {
      type: 'input',
      name: 'privateKey',
      message: messages.privateKeyInputInstruction,
      when: (state) => state.source === 'manual',
      validate: (answer) => validations.isValidPrivateKey(answer) || chalk.red(messages.privateKeyInputError(chalk.yellow(answer))),
      filter: (answer) => {
        const prefixRegex = /^0x/g;
        if (answer.match(prefixRegex) !== null) {
          return answer;
        }
        return `0x${answer}`;
      }
    }
  ]);

export default askForPrivateKeyDialog;
