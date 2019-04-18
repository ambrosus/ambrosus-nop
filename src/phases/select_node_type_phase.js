/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import {APOLLO} from '../consts';

const selectRole = async (stateModel, askForNodeTypeDialog, askForApolloMinimalDepositDialog) => {
  const existingRole = await stateModel.getRole();
  if (existingRole !== null) {
    return existingRole;
  }

  const {nodeType} = await askForNodeTypeDialog();
  if (nodeType === APOLLO) {
    const deposit = await askForApolloMinimalDepositDialog();
    await stateModel.storeApolloMinimalDeposit(deposit);
  }
  await stateModel.storeRole(nodeType);
  return nodeType;
};

const selectNodeTypePhase = (stateModel, askForNodeTypeDialog, askForApolloMinimalDepositDialog, roleSelectedDialog) => async () => {
  const selectedRole = await selectRole(stateModel, askForNodeTypeDialog, askForApolloMinimalDepositDialog);
  await roleSelectedDialog(selectedRole);
  return selectedRole;
};

export default selectNodeTypePhase;
