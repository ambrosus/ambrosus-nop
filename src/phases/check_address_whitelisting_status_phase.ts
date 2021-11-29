/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import Dialog from '../models/dialog_model';
import StateModel from '../models/state_model';
import SmartContractsModel from '../models/smart_contracts_model';

const checkAddressWhitelistingStatusPhase = async () => {
  const userAddress = await StateModel.getAddress();
  if (await SmartContractsModel.isAddressWhitelisted(userAddress) === false) {
    Dialog.addressIsNotWhitelistedDialog();
    return null;
  }

  const {requiredDeposit, roleAssigned} = await SmartContractsModel.getAddressWhitelistingData(userAddress);
  Dialog.addressIsWhitelistedDialog(requiredDeposit, roleAssigned);

  const existingRole = await StateModel.getRole();
  if (existingRole === null) {
    await StateModel.storeRole(roleAssigned);
  }
  if (existingRole !== null && existingRole !== roleAssigned) {
    throw new Error('Role selected differs from role assigned in whitelist. Please contact Ambrosus Tech Support');
  }

  return {requiredDeposit, roleAssigned};
};

export default checkAddressWhitelistingStatusPhase;
