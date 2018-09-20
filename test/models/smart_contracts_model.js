/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import SmartContractsModel from '../../src/models/smart_contracts_model';
import {ATLAS_1_STAKE, ATLAS_2_STAKE, ATLAS_3_STAKE, APOLLO, APOLLO_CODE, HERMES_CODE, HERMES, ATLAS_CODE, ATLAS_1, ATLAS_2, ATLAS_3} from '../../src/consts';

chai.use(chaiAsPromised);
chai.use(sinonChai);
const {expect} = chai;

describe('Smart Contract Model', () => {
  let kycWhitelistWrapperStub;
  let smartContractsModel;

  const exampleBoolean = true;
  const exampleAddress = '0xB1D28124D5771dD347a0BDECbC72CFb2BFf4B2D7';

  beforeEach(async () => {
    kycWhitelistWrapperStub = {
      isWhitelisted: sinon.stub().resolves(exampleBoolean),
      getRequiredDeposit: sinon.stub().resolves(ATLAS_1_STAKE),
      getRoleAssigned: sinon.stub()
    };
    smartContractsModel = new SmartContractsModel(kycWhitelistWrapperStub, {});
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
});
