/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import {APOLLO, ATLAS_1, ATLAS_2, ATLAS_3, HERMES, NO_ROLE_CODE} from '../consts';
import utils from '../utils/web3_utils';
import {roleCodeToRole} from '../utils/role_converters';

export default class SmartContractsModel {
  constructor(crypto, kycWhitelistWrapper, rolesWrapper) {
    this.crypto = crypto;
    this.kycWhitelistWrapper = kycWhitelistWrapper;
    this.rolesWrapper = rolesWrapper;
  }

  async isAddressWhitelisted(address) {
    return await this.kycWhitelistWrapper.isWhitelisted(address);
  }

  async getAddressWhitelistingData(address) {
    const requiredDeposit = await this.kycWhitelistWrapper.getRequiredDeposit(address);
    const roleAssigned = roleCodeToRole(await this.kycWhitelistWrapper.getRoleAssigned(address), requiredDeposit);

    return {requiredDeposit, roleAssigned};
  }

  async hasEnoughBalance(address, requiredBalance) {
    const balance = await this.crypto.getBalance(address);
    return utils.toBN(requiredBalance)
      .lte(balance);
  }

  async getOnboardedRole(address) {
    const roleCode = await this.rolesWrapper.onboardedRole(address);
    if (roleCode === NO_ROLE_CODE) {
      return null;
    }
    const deposit = await this.kycWhitelistWrapper.getRequiredDeposit(address);
    return roleCodeToRole(roleCode, deposit);
  }

  hashData(data) {
    return this.crypto.hashData(data);
  }

  signMessage(data, privateKey) {
    const {signature} = this.crypto.sign(data, privateKey);
    return signature;
  }

  async performOnboarding(address, role, deposit, url) {
    switch (role) {
      case HERMES:
        return this.rolesWrapper.onboardAsHermes(address, url);
      case APOLLO:
        return this.rolesWrapper.onboardAsApollo(address, deposit);
      case ATLAS_1:
      case ATLAS_2:
      case ATLAS_3:
        return this.rolesWrapper.onboardAsAtlas(address, deposit, url);
      default:
        throw new Error(`Unknown role: ${role}`);
    }
  }
}
