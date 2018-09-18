/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import {HERMES, APOLLO, ATLAS_1_STAKE, ATLAS_1, ATLAS_2_STAKE, ATLAS_2, ATLAS_3_STAKE, ATLAS_3, ATLAS_CODE, HERMES_CODE, APOLLO_CODE} from '../consts';

export default class SmartContractsModel {
  constructor(kycWhitelistWrapper, rolesWrapper) {
    this.kycWhitelistWrapper = kycWhitelistWrapper;
    this.rolesWrapper = rolesWrapper;
  }

  async isAddressWhitelisted(address) {
    return await this.kycWhitelistWrapper.isWhitelisted(address);
  }

  async getAddressWhitelistingData(address) {
    const requiredDeposit = await this.kycWhitelistWrapper.getRequiredDeposit(address);
    const roleAssigned = this.roleCodeToRole(await this.kycWhitelistWrapper.getRoleAssigned(address), requiredDeposit);

    return {requiredDeposit, roleAssigned};
  }

  roleCodeToRole(roleCode, deposit) {
    switch (roleCode) {
      case ATLAS_CODE:
        return this.atlasStakeAmountToRole(deposit);
      case HERMES_CODE:
        return HERMES;
      case APOLLO_CODE:
        return APOLLO;
      default:
        return null;
    }
  }

  atlasStakeAmountToRole(deposit) {
    switch (deposit) {
      case ATLAS_1_STAKE:
        return ATLAS_1;
      case ATLAS_2_STAKE:
        return ATLAS_2;
      case ATLAS_3_STAKE:
        return ATLAS_3;
      default:
        return null;
    }
  }
}
