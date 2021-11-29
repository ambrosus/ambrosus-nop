/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import {APOLLO} from '../consts';
import Dialog from '../models/dialog_model';
import StateModel from '../models/state_model';

const selectRole = async () => {
  const existingRole = await StateModel.getRole();
  if (existingRole !== null) {
    return existingRole;
  }

  const {nodeType} = await Dialog.askForNodeTypeDialog();
  if (nodeType === APOLLO) {
    const deposit = await Dialog.askForApolloMinimalDepositDialog();
    await StateModel.storeApolloMinimalDeposit(deposit);
  }
  await StateModel.storeRole(nodeType);
  return nodeType;
};

const selectNodeTypePhase = async () => {
  const selectedRole = await selectRole();
  Dialog.roleSelectedDialog(selectedRole);
  return selectedRole;
};

export default selectNodeTypePhase;
