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

import getNodeTypeUrl from '../../src/phases/get_node_url_phase';
import {APOLLO, ATLAS_1} from '../../src/consts';

chai.use(chaiAsPromised);
chai.use(sinonChai);
const {expect} = chai;

describe('Get Node Url Phase', () => {
  let stateModelStub;
  let nodeUrlDetectedDialogStub;
  let askForNodeUrlDialogStub;

  const exampleUrl = 'https://amb-node.com';

  const call = async () => getNodeTypeUrl(stateModelStub, nodeUrlDetectedDialogStub, askForNodeUrlDialogStub)();

  beforeEach(async () => {
    stateModelStub = {
      getNodeUrl: sinon.stub(),
      storeNodeUrl: sinon.stub(),
      getRole: sinon.stub()
    };
    nodeUrlDetectedDialogStub = sinon.stub();
    askForNodeUrlDialogStub = sinon.stub();
  });

  it('throws if role has not been selected yet', async () => {
    stateModelStub.getRole.resolves(null);

    await expect(call()).to.eventually.be.rejected;

    expect(stateModelStub.getRole).to.have.been.calledOnce;
    expect(stateModelStub.getNodeUrl).to.have.not.been.called;
    expect(askForNodeUrlDialogStub).to.have.not.been.called;
    expect(stateModelStub.storeNodeUrl).to.have.not.been.called;
    expect(nodeUrlDetectedDialogStub).to.have.not.been.called;
  });

  it('ends if node role is Apollo', async () => {
    stateModelStub.getRole.resolves(APOLLO);

    const ret = await call();

    expect(stateModelStub.getRole).to.have.been.calledOnce;
    expect(stateModelStub.getNodeUrl).to.have.not.been.called;
    expect(askForNodeUrlDialogStub).to.have.not.been.called;
    expect(stateModelStub.storeNodeUrl).to.have.not.been.called;
    expect(nodeUrlDetectedDialogStub).to.have.not.been.called;
    expect(ret).to.equal(null);
  });

  it('ends if a URL is already in the store', async () => {
    stateModelStub.getRole.resolves(ATLAS_1);
    stateModelStub.getNodeUrl.resolves(exampleUrl);

    const ret = await call();

    expect(stateModelStub.getRole).to.have.been.calledOnce;
    expect(stateModelStub.getNodeUrl).to.have.been.calledOnce;
    expect(askForNodeUrlDialogStub).to.have.not.been.called;
    expect(stateModelStub.storeNodeUrl).to.have.not.been.called;
    expect(nodeUrlDetectedDialogStub).to.have.been.calledOnceWith(exampleUrl);
    expect(ret).to.equal(exampleUrl);
  });

  it('stores correctly provided URL', async () => {
    stateModelStub.getRole.resolves(ATLAS_1);
    stateModelStub.getNodeUrl.resolves(null);
    askForNodeUrlDialogStub.resolves({
      nodeUrl: exampleUrl
    });

    const ret = await call();

    expect(stateModelStub.getRole).to.have.been.calledOnce;
    expect(stateModelStub.getNodeUrl).to.have.been.calledOnce;
    expect(askForNodeUrlDialogStub).to.have.been.calledOnce;
    expect(stateModelStub.storeNodeUrl).to.have.been.calledOnceWith(exampleUrl);
    expect(nodeUrlDetectedDialogStub).to.have.been.calledOnceWith(exampleUrl);
    expect(ret).to.equal(exampleUrl);
  });
});
