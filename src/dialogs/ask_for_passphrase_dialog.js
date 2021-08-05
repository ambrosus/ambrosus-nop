/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import inquirer from 'inquirer';

const askForPassphraseDialog = (messages) => async () => inquirer.prompt(
  [
    {
      type: 'list',
      name: 'passphraseType',
      message: messages.passphraseTypeQuestion,
      choices: [
        {
          name: messages.passphraseManualAnswer,
          value: 'manual'
        },
        {
          name: messages.passphraseAutoGenerationAnswer,
          value: 'generate'
        }
      ]
    },
    {
      type: 'input',
      name: 'passphrase',
      message: messages.passphraseInputInstruction,
      when: (state) => state.passphraseType === 'manual'
    }
  ]);

export default askForPassphraseDialog;
