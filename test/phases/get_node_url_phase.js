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

import getNodeTypePhase from '../../src/phases/get_node_url_phase';

chai.use(chaiAsPromised);
chai.use(sinonChai);
const {expect} = chai;

describe('Get Node Url Phase', () => {
  let stateModelStub;
  let nodeUrlDetectedDialogStub;
  let askForNodeUrlDialogStub;

  const exampleUrl = 'https://amb-node.com';

  const call = async () => getNodeTypePhase(stateModelStub, nodeUrlDetectedDialogStub, askForNodeUrlDialogStub)();

  beforeEach(async () => {
    stateModelStub = {
      getNodeUrl: sinon.stub(),
      storeNodeUrl: sinon.stub()
    };
    nodeUrlDetectedDialogStub = sinon.stub();
    askForNodeUrlDialogStub = sinon.stub();
  });

  it('ends if a URL is already in the store', async () => {
    stateModelStub.getNodeUrl.resolves(exampleUrl);

    const ret = await call();

    expect(stateModelStub.getNodeUrl).to.have.been.calledOnce;
    expect(askForNodeUrlDialogStub).to.have.not.been.called;
    expect(stateModelStub.storeNodeUrl).to.have.not.been.called;
    expect(nodeUrlDetectedDialogStub).to.have.been.calledOnceWith(exampleUrl);
    expect(ret).to.equal(exampleUrl);
  });

  it('ask the user for a url and stores it', async () => {
    stateModelStub.getNodeUrl.resolves(null);
    askForNodeUrlDialogStub.resolves({
      nodeUrl: exampleUrl
    });

    const ret = await call();

    expect(stateModelStub.getNodeUrl).to.have.been.calledOnce;
    expect(askForNodeUrlDialogStub).to.have.been.calledOnce;
    expect(stateModelStub.storeNodeUrl).to.have.been.calledOnceWith(exampleUrl);
    expect(nodeUrlDetectedDialogStub).to.have.been.calledOnceWith(exampleUrl);
    expect(ret).to.equal(exampleUrl);
  });
});
