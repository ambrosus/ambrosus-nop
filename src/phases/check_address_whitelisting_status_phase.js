/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

const checkAddressWhitelistingStatusPhase = (smartContractsModel, stateModel, addressIsNotWhitelistedDialog, addressIsWhitelistedDialog) => async () => {
  const userAddress = await stateModel.getAddress();
  console.log(userAddress);
  if (await smartContractsModel.isAddressWhitelisted(userAddress) === false) {
    await addressIsNotWhitelistedDialog();
    return null;
  }

  const {requiredDeposit, roleAssigned} = await smartContractsModel.getAddressWhitelistingData(userAddress);
  await addressIsWhitelistedDialog(requiredDeposit, roleAssigned);

  const existingRole = await stateModel.getRole();
  if (existingRole === null) {
    await stateModel.storeRole(roleAssigned);
  }
  if (existingRole !== null && existingRole !== roleAssigned) {
    throw new Error('Role selected differs from role assigned in whitelist. Please contact Ambrosus Tech Support');
  }

  return {requiredDeposit, roleAssigned};
};

export default checkAddressWhitelistingStatusPhase;
