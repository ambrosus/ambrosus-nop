/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

const selectActionPhase = (actions, selectActionDialog) => async () => {
  const actionSelectionList = Object.keys(actions);
  let shouldQuit = false;
  while (!shouldQuit) {
    const {action: selectedAction} = await selectActionDialog(actionSelectionList);
    try {
      shouldQuit = await actions[selectedAction]();
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  }
};

export default selectActionPhase;
