/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import {APOLLO, HERMES, ATLAS_1, ATLAS_2, ATLAS_3} from '../consts';
import inquirer from 'inquirer';

const askForNodeTypeDialog = (messages) => async () => inquirer.prompt(
  [
    {
      type: 'list',
      name: 'nodeType',
      message: messages.nodeTypeQuestion,
      choices: [
        {
          name: messages.apolloName,
          value: APOLLO
        },
        {
          name: messages.hermesName,
          value: HERMES
        },
        {
          name: messages.atlasName,
          value: 'atlasSelection'
        }
      ]
    },
    {
      when: (state) => state.nodeType === 'atlasSelection',
      type: 'list',
      name: 'nodeType',
      message: messages.atlasVersionQuestion,
      choices: [
        {
          name: messages.atlas3Name,
          value: ATLAS_3
        },
        {
          name: messages.atlas2Name,
          value: ATLAS_2
        },
        {
          name: messages.atlas1Name,
          value: ATLAS_1
        }
      ]
    }
  ]);

export default askForNodeTypeDialog;
