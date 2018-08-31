/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import {APOLLO, HERMES, ATLAS_1, ATLAS_2, ATLAS_3} from '../consts';
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
          value: APOLLO
        },
        {
          name: 'Hermes',
          value: HERMES
        },
        {
          name: 'Atlas',
          value: 'Atlas'
        }
      ]
    },
    {
      when: (state) => state.nodeType === 'Atlas',
      type: 'list',
      name: 'nodeType',
      message: `Which Atlas version do you want to run?`,
      choices: [
        {
          name: 'Omega',
          value: ATLAS_3
        },
        {
          name: 'Sigma',
          value: ATLAS_2
        },
        {
          name: 'Zeta',
          value: ATLAS_1
        }
      ]
    }
  ]);

export default askForNodeTypeDialog;
