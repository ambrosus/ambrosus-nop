/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import {roleToRoleCode} from '../utils/role_converters';

const selectActionPhase = (actions, selectActionDialog, insufficientFundsDialog, genericErrorDialog) => async (nodeRole) => {
  const actionSelectionList = Object.keys(actions)
    .filter((key) => actions[key].nodeTypes.includes(roleToRoleCode(nodeRole)));
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
