/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import chalk from 'chalk';
import marked from 'marked';
import TerminalRenderer from 'marked-terminal'
import inquirer from 'inquirer';

marked.setOptions({
  // Define custom renderer
  renderer: new TerminalRenderer()
});

const acceptTosDialog = (validations, messages) => async (tosText) => {
  console.log(chalk.red(messages.acceptTos));
  console.log(marked(tosText));
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
