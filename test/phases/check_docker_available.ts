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
import System from '../../src/services/system';
import checkDockerAvailablePhase from '../../src/phases/check_docker_available_phase';

chai.use(chaiAsPromised);
chai.use(sinonChai);
const {expect} = chai;

describe('Check docker available', () => {
  let systemModelStub;

  const call = checkDockerAvailablePhase;

  beforeEach(async () => {
    systemModelStub = {
      isDockerAvailable: sinon.stub()
    };
    System.isDockerAvailable = systemModelStub.isDockerAvailable;
    Dialog.dockerDetectedDialog = sinon.stub().resolves();
    Dialog.dockerMissingDialog = sinon.stub().resolves();
  });

  it('displays confirmation dialog if docker available', async () => {
    systemModelStub.isDockerAvailable.resolves(true);

    const ret = await call();

    expect(systemModelStub.isDockerAvailable).to.have.been.calledOnce;
    expect(Dialog.dockerDetectedDialog).to.have.been.called;
    expect(Dialog.dockerMissingDialog).to.not.have.been.called;
    expect(ret).to.equal(true);
  });

  it('displays error dialog if not docker available', async () => {
    systemModelStub.isDockerAvailable.resolves(false);

    const ret = await call();

    expect(systemModelStub.isDockerAvailable).to.have.been.calledOnce;
    expect(Dialog.dockerDetectedDialog).to.not.have.been.called;
    expect(Dialog.dockerMissingDialog).to.have.been.called;
    expect(ret).to.equal(false);
  });
});
