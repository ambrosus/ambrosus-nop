/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

const selectRole = async (stateModel, askForNodeTypeDialog) => {
  const existingRole = await stateModel.getRole();
  if (existingRole !== null) {
    return existingRole;
  }

  const answers = await askForNodeTypeDialog();
  const {nodeType} = answers;
  await stateModel.storeRole(nodeType);
  return nodeType;
};

const selectNodeTypePhase = (stateModel, askForNodeTypeDialog, roleSelectedDialog) => async () => {
  const selectedRole = await selectRole(stateModel, askForNodeTypeDialog);
  await roleSelectedDialog(selectedRole);
  return selectedRole;
};

export default selectNodeTypePhase;
