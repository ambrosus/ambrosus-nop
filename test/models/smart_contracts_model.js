/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import SmartContractsModel from '../../src/models/smart_contracts_model';
import utils from '../../src/utils/web3_utils';
import {
  ATLAS_1_STAKE,
  ATLAS_2_STAKE,
  ATLAS_3_STAKE,
  APOLLO,
  APOLLO_CODE,
  HERMES_CODE,
  HERMES,
  ATLAS_CODE,
  ATLAS_1,
  ATLAS_2,
  ATLAS_3,
  NO_ROLE_CODE
} from '../../src/consts';

chai.use(chaiAsPromised);
chai.use(sinonChai);
const {expect} = chai;

describe('Smart Contract Model', () => {
  let cryptoStub;
  let rolesWrapperStub;
  let kycWhitelistWrapperStub;
  let smartContractsModel;

  const exampleBoolean = true;
  const exampleAddress = '0xB1D28124D5771dD347a0BDECbC72CFb2BFf4B2D7';

  beforeEach(() => {
    cryptoStub = {
      getBalance: sinon.stub()
    };
    kycWhitelistWrapperStub = {
      isWhitelisted: sinon.stub().resolves(exampleBoolean),
      getRequiredDeposit: sinon.stub().resolves(ATLAS_1_STAKE),
      getRoleAssigned: sinon.stub()
    };
    rolesWrapperStub = {
      onboardAsHermes: sinon.stub(),
      onboardAsApollo: sinon.stub(),
      onboardAsAtlas: sinon.stub(),
      onboardedRole: sinon.stub().resolves(null)
    };
    smartContractsModel = new SmartContractsModel(cryptoStub, kycWhitelistWrapperStub, rolesWrapperStub);
  });

  describe('isAddressWhitelisted', async () => {
    it('asks wrapper if the address is whitelisted', async () => {
      await smartContractsModel.isAddressWhitelisted(exampleAddress);
      expect(kycWhitelistWrapperStub.isWhitelisted).to.have.been.calledOnceWith(exampleAddress);
    });

    it('returns smart contract answer', async () => {
      expect(await smartContractsModel.isAddressWhitelisted(exampleAddress)).to.equal(exampleBoolean);
    });
  });

  describe('getAddressWhitelistingData', async () => {
    it('asks wrapper for required deposit', async () => {
      await smartContractsModel.getAddressWhitelistingData(exampleAddress);
      expect(kycWhitelistWrapperStub.getRequiredDeposit).to.have.been.calledOnceWith(exampleAddress);
    });

    it('asks wrapper for assigned role code', async () => {
      await smartContractsModel.getAddressWhitelistingData(exampleAddress);
      expect(kycWhitelistWrapperStub.getRoleAssigned).to.have.been.calledOnceWith(exampleAddress);
    });

    it('returns required deposit', async () => {
      expect((await smartContractsModel.getAddressWhitelistingData(exampleAddress)).requiredDeposit).to.equal(ATLAS_1_STAKE);
    });

    describe('returns correct role, according to role code and required deposit', async () => {
      it('Apollo', async () => {
        kycWhitelistWrapperStub.getRoleAssigned.resolves(APOLLO_CODE);
        expect((await smartContractsModel.getAddressWhitelistingData(exampleAddress)).roleAssigned).to.equal(APOLLO);
      });

      it('Hermes', async () => {
        kycWhitelistWrapperStub.getRoleAssigned.resolves(HERMES_CODE);
        expect((await smartContractsModel.getAddressWhitelistingData(exampleAddress)).roleAssigned).to.equal(HERMES);
      });

      it('Atlas Zeta', async () => {
        kycWhitelistWrapperStub.getRoleAssigned.resolves(ATLAS_CODE);
        kycWhitelistWrapperStub.getRequiredDeposit.resolves(ATLAS_1_STAKE);
        expect((await smartContractsModel.getAddressWhitelistingData(exampleAddress)).roleAssigned).to.equal(ATLAS_1);
      });

      it('Atlas Sigma', async () => {
        kycWhitelistWrapperStub.getRoleAssigned.resolves(ATLAS_CODE);
        kycWhitelistWrapperStub.getRequiredDeposit.resolves(ATLAS_2_STAKE);
        expect((await smartContractsModel.getAddressWhitelistingData(exampleAddress)).roleAssigned).to.equal(ATLAS_2);
      });

      it('Atlas Omega', async () => {
        kycWhitelistWrapperStub.getRoleAssigned.resolves(ATLAS_CODE);
        kycWhitelistWrapperStub.getRequiredDeposit.resolves(ATLAS_3_STAKE);
        expect((await smartContractsModel.getAddressWhitelistingData(exampleAddress)).roleAssigned).to.equal(ATLAS_3);
      });

      it('null (in case of invalid data)', async () => {
        kycWhitelistWrapperStub.getRoleAssigned.resolves(ATLAS_CODE);
        kycWhitelistWrapperStub.getRequiredDeposit.resolves('0');
        expect((await smartContractsModel.getAddressWhitelistingData(exampleAddress)).roleAssigned).to.equal(null);
      });
    });
  });

  describe('hasEnoughBalance', () => {
    const balance = utils.toBN('100');

    beforeEach(() => {
      cryptoStub.getBalance.resolves(balance);
    });

    it('asks crypto for accounts balance', async () => {
      await smartContractsModel.hasEnoughBalance(exampleAddress, 0);
      expect(cryptoStub.getBalance).to.be.calledOnceWith(exampleAddress);
    });

    it('returns true if balance is greater than required balance', async () => {
      expect(await smartContractsModel.hasEnoughBalance(exampleAddress, 99)).to.be.true;
    });

    it('returns true if balance is equal required balance', async () => {
      expect(await smartContractsModel.hasEnoughBalance(exampleAddress, 100)).to.be.true;
    });

    it('returns false if balance is less than required balance', async () => {
      expect(await smartContractsModel.hasEnoughBalance(exampleAddress, 101)).to.be.false;
    });

    it('works when required balance is passed as string', async () => {
      expect(await smartContractsModel.hasEnoughBalance(exampleAddress, '100')).to.be.true;
      expect(await smartContractsModel.hasEnoughBalance(exampleAddress, '101')).to.be.false;
    });

    it('works when required balance is passed as a big number', async () => {
      expect(await smartContractsModel.hasEnoughBalance(exampleAddress, utils.toBN(100))).to.be.true;
      expect(await smartContractsModel.hasEnoughBalance(exampleAddress, utils.toBN(101))).to.be.false;
    });
  });

  describe('getOnboardedRole', () => {
    it('gets role with kyced deposit and returnes onboarded role name', async () => {
      rolesWrapperStub.onboardedRole.resolves(ATLAS_CODE);
      expect(await smartContractsModel.getOnboardedRole(exampleAddress)).to.equal('Atlas Zeta');
      expect(rolesWrapperStub.onboardedRole).to.be.calledOnceWith(exampleAddress);
      expect(kycWhitelistWrapperStub.getRequiredDeposit).to.be.calledOnceWith(exampleAddress);
    });

    it('returns null if onboardedRole returns 0', async () => {
      rolesWrapperStub.onboardedRole.resolves(NO_ROLE_CODE);
      expect(await smartContractsModel.getOnboardedRole(exampleAddress)).to.be.null;
    });
  });

  describe('performOnboarding', () => {
    const url = 'http://amb.to';
    const deposit = 10;

    it('when role is HERMES calls onboardAsHermes', async () => {
      await smartContractsModel.performOnboarding(exampleAddress, HERMES, deposit, url);
      expect(rolesWrapperStub.onboardAsHermes).to.be.calledWith(exampleAddress, url);
    });

    it('when role is APOLLO calls onboardAsApollo', async () => {
      await smartContractsModel.performOnboarding(exampleAddress, APOLLO, deposit, url);
      expect(rolesWrapperStub.onboardAsApollo).to.be.calledWith(exampleAddress, deposit);
    });

    it('when role is ATLAS_1 calls onboardAsAtlas', async () => {
      await smartContractsModel.performOnboarding(exampleAddress, ATLAS_1, deposit, url);
      expect(rolesWrapperStub.onboardAsAtlas).to.be.calledWith(exampleAddress, deposit, url);
    });

    it('when role is ATLAS_2 calls onboardAsAtlas', async () => {
      await smartContractsModel.performOnboarding(exampleAddress, ATLAS_2, deposit, url);
      expect(rolesWrapperStub.onboardAsAtlas).to.be.calledWith(exampleAddress, deposit, url);
    });

    it('when role is ATLAS_3 calls onboardAsAtlas', async () => {
      await smartContractsModel.performOnboarding(exampleAddress, ATLAS_3, deposit, url);
      expect(rolesWrapperStub.onboardAsAtlas).to.be.calledWith(exampleAddress, deposit, url);
    });

    it('when role is unknown throws', async () => {
      await expect(smartContractsModel.performOnboarding(exampleAddress, 'unknown role', deposit, url)).to.be.eventually.rejected;
    });
  });
});
