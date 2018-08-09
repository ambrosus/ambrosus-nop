/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import inquirer from 'inquirer';

const askForPrivateKeyDialog = (crypto) => async () => inquirer.prompt(
  [
    {
      type: 'list',
      name: 'source',
      message: `No private key setup yet. What do you want to do?`,
      choices: [
        {
          name: 'Input existing key manually',
          value: 'manual'
        },
        {
          name: 'Generate new key automatically',
          value: 'generate'
        }
      ]
    },
    {
      type: 'input',
      name: 'privateKey',
      message: `Please provide your private key in hex form:`,
      when: (state) => state.source === 'manual',
      validate: async (answer) => await crypto.isValidPrivateKey(answer) || 'The provided value is not a valid address'
    }
  ]);

export default askForPrivateKeyDialog;
