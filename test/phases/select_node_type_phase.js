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

import selectNodeTypePhase from '../../src/phases/select_node_type_phase';
import {APOLLO, ATLAS_1} from '../../src/consts';

chai.use(chaiAsPromised);
chai.use(sinonChai);
const {expect} = chai;

describe('Select Node Type Phase', () => {
  let stateModelStub;
  let askForNodeTypeDialogStub;
  let roleSelectedDialogStub;
  let askForApolloDepositDialogStub;
  const exampleRole = ATLAS_1;
  const exampleDeposit = '123';

  const call = async () => selectNodeTypePhase(stateModelStub, askForNodeTypeDialogStub, askForApolloDepositDialogStub, roleSelectedDialogStub)();

  beforeEach(async () => {
    stateModelStub = {
      storeRole: sinon.stub(),
      getRole: sinon.stub(),
      storeApolloMinimalDeposit: sinon.stub()
    };
    askForNodeTypeDialogStub = sinon.stub();
    askForApolloDepositDialogStub = sinon.stub().resolves(exampleDeposit);
    roleSelectedDialogStub = sinon.stub();
  });

  it('ends if a role is already in the store', async () => {
    stateModelStub.getRole.resolves(exampleRole);

    const ret = await call();

    expect(stateModelStub.getRole).to.have.been.calledOnce;
    expect(askForNodeTypeDialogStub).to.not.have.been.called;
    expect(roleSelectedDialogStub).to.have.been.calledOnceWith(exampleRole);
    expect(ret).to.equal(exampleRole);
  });

  it('asks and saves deposit value when selected APOLLO', async () => {
    stateModelStub.getRole.resolves(null);
    askForNodeTypeDialogStub.resolves({
      nodeType: APOLLO
    });

    await call();
    expect(askForApolloDepositDialogStub).to.be.calledOnce;
    expect(stateModelStub.storeApolloMinimalDeposit).to.be.calledOnceWith(exampleDeposit);
  });

  it('stores correctly selected role', async () => {
    stateModelStub.getRole.resolves(null);
    askForNodeTypeDialogStub.resolves({
      nodeType: exampleRole
    });

    const ret = await call();

    expect(stateModelStub.getRole).to.have.been.calledOnce;
    expect(askForNodeTypeDialogStub).to.have.been.calledOnce;
    expect(stateModelStub.storeRole).to.have.been.calledOnceWith(exampleRole);
    expect(roleSelectedDialogStub).to.have.been.calledOnceWith(exampleRole);
    expect(ret).to.equal(exampleRole);
  });
});
