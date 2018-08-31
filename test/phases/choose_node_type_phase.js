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

import chooseNodeTypePhase from '../../src/phases/choose_node_type_phase';

chai.use(chaiAsPromised);
chai.use(sinonChai);
const {expect} = chai;

describe('Choose Node Type Phase', () => {
  let stateModelStub;
  let askForNodeTypeDialogStub;

  const call = async () => chooseNodeTypePhase(stateModelStub, askForNodeTypeDialogStub)();

  beforeEach(async () => {
    stateModelStub = {
      storeRole: sinon.stub()
    };
    askForNodeTypeDialogStub = sinon.stub();
  });

  it('stores correctly if user has chosen Apollo or Hermes (non-Atlas)', async () => {
    askForNodeTypeDialogStub.resolves({
      nodeType: 'hermes'
    });

    const ret = await call();

    expect(askForNodeTypeDialogStub).to.have.been.calledOnce;
    expect(stateModelStub.storeRole).to.have.been.calledOnceWith('hermes');
    expect(ret).to.equal('hermes');
  });

  it('stores correctly if user has chosen Atlas', async () => {
    askForNodeTypeDialogStub.resolves({
      nodeType: 'atlas',
      atlasType: 'atlas1'
    });

    const ret = await call();

    expect(askForNodeTypeDialogStub).to.have.been.calledOnce;
    expect(stateModelStub.storeRole).to.have.been.calledOnceWith('atlas1');
    expect(ret).to.equal('atlas1');
  });
});
