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

import selectNodeTypePhase from '../../src/phases/select_node_type_phase';
import {ATLAS_1} from '../../src/consts';

chai.use(chaiAsPromised);
chai.use(sinonChai);
const {expect} = chai;

describe('Select Node Type Phase', () => {
  let stateModelStub;
  let askForNodeTypeDialogStub;
  let roleSelectedDialogStub;

  const exampleRole = ATLAS_1;

  const call = async () => selectNodeTypePhase(stateModelStub, askForNodeTypeDialogStub, roleSelectedDialogStub)();

  beforeEach(async () => {
    stateModelStub = {
      storeRole: sinon.stub(),
      getExistingRole: sinon.stub()
    };
    askForNodeTypeDialogStub = sinon.stub();
    roleSelectedDialogStub = sinon.stub();
  });

  it('ends if a role is already in the store', async () => {
    stateModelStub.getExistingRole.resolves(exampleRole);

    const ret = await call();

    expect(stateModelStub.getExistingRole).to.have.been.calledOnce;
    expect(askForNodeTypeDialogStub).to.not.have.been.called;
    expect(roleSelectedDialogStub).to.have.been.calledOnceWith(exampleRole);
    expect(ret).to.equal(exampleRole);
  });

  it('stores correctly selected role', async () => {
    stateModelStub.getExistingRole.resolves(null);
    askForNodeTypeDialogStub.resolves({
      nodeType: exampleRole
    });

    const ret = await call();

    expect(stateModelStub.getExistingRole).to.have.been.calledOnce;
    expect(askForNodeTypeDialogStub).to.have.been.calledOnce;
    expect(stateModelStub.storeRole).to.have.been.calledOnceWith(exampleRole);
    expect(roleSelectedDialogStub).to.have.been.calledOnceWith(exampleRole);
    expect(ret).to.equal(exampleRole);
  });
});
