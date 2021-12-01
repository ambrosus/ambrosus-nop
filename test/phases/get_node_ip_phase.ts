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

import Dialog from '../../src/models/dialog_model';
import StateModel from '../../src/models/state_model';
import getNodeIPPhase from '../../src/phases/get_node_ip_phase';

chai.use(chaiAsPromised);
chai.use(sinonChai);
const {expect} = chai;

describe('Get Node IP Phase', () => {
  let stateModelStub;
  let askForNodeIPDialogStub;
  let nodeIPDetectedDialogStub;

  const exampleStoredIP = '127.0.0.1';
  const exampleUserProvidedIP = '192.168.0.2';

  const call = getNodeIPPhase;

  beforeEach(async () => {
    stateModelStub = {
      getNodeIP: sinon.stub(),
      storeNodeIP: sinon.stub()
    };
    StateModel.getNodeIP = stateModelStub.getNodeIP;
    StateModel.storeNodeIP = stateModelStub.storeNodeIP;

    askForNodeIPDialogStub = sinon.stub();
    nodeIPDetectedDialogStub = sinon.stub();

    Dialog.askForNodeIPDialog = askForNodeIPDialogStub;
    Dialog.nodeIPDetectedDialog = nodeIPDetectedDialogStub;
  });

  it('ends if a IP is already in the store', async () => {
    stateModelStub.getNodeIP.resolves(exampleStoredIP);

    await expect(call()).to.eventually.be.equal(exampleStoredIP);

    expect(stateModelStub.getNodeIP).to.have.been.calledOnce;
    expect(askForNodeIPDialogStub).to.not.have.been.called;
    expect(stateModelStub.storeNodeIP).to.not.have.been.called;
    expect(nodeIPDetectedDialogStub).to.have.been.calledOnceWith(exampleStoredIP);
  });

  it('ask the user for a IP address and stores it', async () => {
    stateModelStub.getNodeIP.resolves(null);
    askForNodeIPDialogStub.resolves({
      nodeIP: exampleUserProvidedIP
    });

    await expect(call()).to.eventually.be.equal(exampleUserProvidedIP);

    expect(stateModelStub.getNodeIP).to.have.been.calledOnce;
    expect(askForNodeIPDialogStub).to.have.been.calledOnce;
    expect(stateModelStub.storeNodeIP).to.have.been.calledOnceWith(exampleUserProvidedIP);
    expect(nodeIPDetectedDialogStub).to.have.been.calledOnceWith(exampleUserProvidedIP);
  });
});
