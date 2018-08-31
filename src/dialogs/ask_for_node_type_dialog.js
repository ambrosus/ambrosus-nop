/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import inquirer from 'inquirer';

const askForNodeTypeDialog = () => async () => inquirer.prompt(
  [
    {
      type: 'list',
      name: 'nodeType',
      message: `Which node do you want to run?`,
      choices: [
        {
          name: 'Apollo',
          value: 'apollo'
        },
        {
          name: 'Hermes',
          value: 'hermes'
        },
        {
          name: 'Atlas',
          value: 'atlas'
        }
      ]
    },
    {
      when: (state) => state.nodeType === 'atlas',
      type: 'list',
      name: 'atlasType',
      message: `Which Atlas version do you want to run?`,
      choices: [
        {
          name: 'Omega',
          value: 'atlas3'
        },
        {
          name: 'Sigma',
          value: 'atlas2'
        },
        {
          name: 'Zeta',
          value: 'atlas1'
        }
      ]
    }
  ]);

export default askForNodeTypeDialog;
