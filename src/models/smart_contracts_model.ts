/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import {APOLLO, ATLAS_1, ATLAS_2, ATLAS_3, HERMES, NO_ROLE_CODE} from '../consts';
import utils from '../utils/web3_utils';
import {roleCodeToRole} from '../utils/role_converters';
import Crypto from '../services/crypto';
import {HeadWrapper, KycWhitelistWrapper, RolesWrapper, PayoutsWrapper, TimeWrapper, PayoutsActions, OnboardActions, AtlasStakeStoreWrapper} from 'ambrosus-node-contracts';
import {Network} from '../interfaces/network';

class SmartContractsModel {
  headWrapper: any = null;
  kycWhitelistWrapper: any = null;
  rolesWrapper: any = null;
  timeWrapper: any = null;
  payoutsWrapper: any = null;
  atlasStakeWrapper: any = null;
  payoutsActions: any = null;
  onboardActions: any = null;

  init(network: Network) {
    this.headWrapper = new HeadWrapper(network.headContractAddress, Crypto.web3, Crypto.address);
    this.kycWhitelistWrapper = new KycWhitelistWrapper(this.headWrapper, Crypto.web3, Crypto.address);
    this.rolesWrapper = new RolesWrapper(this.headWrapper, Crypto.web3, Crypto.address);
    this.timeWrapper = new TimeWrapper(this.headWrapper, Crypto.web3, Crypto.address);
    this.payoutsWrapper = new PayoutsWrapper(this.headWrapper, Crypto.web3, Crypto.address);
    this.atlasStakeWrapper = new AtlasStakeStoreWrapper(this.headWrapper, Crypto.web3, Crypto.address);
    this.payoutsActions = new PayoutsActions(this.timeWrapper, this.payoutsWrapper);
    this.onboardActions = new OnboardActions(this.kycWhitelistWrapper, this.rolesWrapper, this.atlasStakeWrapper);
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
    const balance = await Crypto.getBalance(address);
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
    return Crypto.hashData(data);
  }

  signMessage(data, privateKey) {
    const {signature} = Crypto.sign(data, privateKey);
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

export default new SmartContractsModel();
