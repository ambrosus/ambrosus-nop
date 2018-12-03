/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

const selectActionPhase = (actions, selectActionDialog) => async () => {
  const actionSelectionList = Object
    .entries(actions)
    .map(
      ([key, value]) => ({
        name: value.name,
        value: key
      }));

  const {action: selectedAction} = await selectActionDialog(actionSelectionList);
  return actions[selectedAction];
};

export default selectActionPhase;
