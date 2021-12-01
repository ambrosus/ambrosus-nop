/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import checkAddressWhitelistingStatus from '../../src/phases/check_address_whitelisting_status_phase';
import Dialog from '../../src/models/dialog_model';
import StateModel from '../../src/models/state_model';
import SmartContractsModel from '../../src/models/smart_contracts_model';
import {ATLAS_1_STAKE, ATLAS_1, HERMES} from '../../src/consts';

chai.use(chaiAsPromised);
chai.use(sinonChai);
const {expect} = chai;

describe('Check Address Whitelisting Status Phase', () => {
  const exampleAddress = '0x123';
  let stateModelStub;
  let smartContractsModelStub;

  const exampleStatus = {
    requiredDeposit: ATLAS_1_STAKE,
    roleAssigned: ATLAS_1
  };

  const call = checkAddressWhitelistingStatus;

  beforeEach(async () => {
    stateModelStub = {
      getRole: sinon.stub(),
      storeRole: sinon.stub(),
      getAddress: sinon.stub().resolves(exampleAddress)
    };
    StateModel.getRole = stateModelStub.getRole;
    StateModel.storeRole = stateModelStub.storeRole;
    StateModel.getAddress = stateModelStub.getAddress;

    smartContractsModelStub = {
      isAddressWhitelisted: sinon.stub(),
      getAddressWhitelistingData: sinon.stub()
    };
    SmartContractsModel.isAddressWhitelisted = smartContractsModelStub.isAddressWhitelisted;
    SmartContractsModel.getAddressWhitelistingData = smartContractsModelStub.getAddressWhitelistingData;

    Dialog.addressIsNotWhitelistedDialog = sinon.stub();
    Dialog.addressIsWhitelistedDialog = sinon.stub();
  });

  it('ends if user is not whitelisted yet', async () => {
    smartContractsModelStub.isAddressWhitelisted.resolves(false);

    const ret = await call();

    expect(smartContractsModelStub.isAddressWhitelisted).to.have.been.calledOnceWith(exampleAddress);
    expect(Dialog.addressIsNotWhitelistedDialog).to.have.been.called;
    expect(smartContractsModelStub.getAddressWhitelistingData).to.have.not.been.called;
    expect(Dialog.addressIsWhitelistedDialog).to.have.not.been.called;
    expect(stateModelStub.getRole).to.have.not.been.called;
    expect(ret).to.equal(null);
  });

  it('returns address whitelisting status if address whitelisted already', async () => {
    smartContractsModelStub.isAddressWhitelisted.resolves(true);
    smartContractsModelStub.getAddressWhitelistingData.resolves(exampleStatus);
    stateModelStub.getRole.resolves(ATLAS_1);

    const ret = await call();

    expect(smartContractsModelStub.isAddressWhitelisted).to.have.been.calledOnce;
    expect(Dialog.addressIsNotWhitelistedDialog).to.have.not.been.called;
    expect(smartContractsModelStub.getAddressWhitelistingData).to.have.been.calledOnceWith(exampleAddress);
    expect(Dialog.addressIsWhitelistedDialog).to.have.been.calledOnceWith(exampleStatus.requiredDeposit, exampleStatus.roleAssigned);
    expect(stateModelStub.getRole).to.have.been.calledOnceWith();
    expect(ret).to.deep.equal(exampleStatus);
  });

  it('stores fetched role if no role already in the store', async () => {
    smartContractsModelStub.isAddressWhitelisted.resolves(true);
    smartContractsModelStub.getAddressWhitelistingData.resolves(exampleStatus);
    stateModelStub.getRole.resolves(null);

    await call();

    expect(stateModelStub.storeRole).to.have.been.calledOnceWith(exampleStatus.roleAssigned);
  });

  it('throws if fetched role does not match already kept in the store', async () => {
    smartContractsModelStub.isAddressWhitelisted.resolves(true);
    smartContractsModelStub.getAddressWhitelistingData.resolves(exampleStatus);
    stateModelStub.getRole.resolves(HERMES);

    expect(call()).to.be.eventually.rejectedWith('Role selected differs from role assigned in whitelist. Please contact Ambrosus Tech Support');
  });
});
