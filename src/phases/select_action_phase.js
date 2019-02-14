/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import {APOLLO, APOLLO_CODE, ATLAS_1, ATLAS_2, ATLAS_3, ATLAS_CODE, HERMES, HERMES_CODE, NO_ROLE_CODE} from '../consts';

const getTypeCode = (nodeRole) => {
  switch (nodeRole) {
    case HERMES:
      return HERMES_CODE;
    case APOLLO:
      return APOLLO_CODE;
    case ATLAS_1:
    case ATLAS_2:
    case ATLAS_3:
      return ATLAS_CODE;
    default:
      return NO_ROLE_CODE;
  }
};

const selectActionPhase = (actions, selectActionDialog, insufficientFundsDialog, genericErrorDialog) => async (nodeRole) => {
  const actionSelectionList = Object.keys(actions)
    .filter((key) => actions[key].nodeTypes.includes(getTypeCode(nodeRole)));
  let shouldQuit = false;
  while (!shouldQuit) {
    const {action: selectedAction} = await selectActionDialog(actionSelectionList);
    try {
      shouldQuit = await actions[selectedAction].performAction();
    } catch (err) {
      if (err.message.includes('Insufficient funds')) {
        await insufficientFundsDialog();
      } else {
        await genericErrorDialog(err.message);
      }
    }
  }
};

export default selectActionPhase;
