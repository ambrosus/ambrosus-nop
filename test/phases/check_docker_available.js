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

import checkDockerAvailablePhase from '../../src/phases/check_docker_available_phase';

chai.use(chaiAsPromised);
chai.use(sinonChai);
const {expect} = chai;

describe('Check docker available', () => {
  let systemModelStub;
  let dockerDetectedDialogStub;
  let dockerMissingDialogStub;

  const call = async () => checkDockerAvailablePhase(systemModelStub, dockerDetectedDialogStub, dockerMissingDialogStub)();

  beforeEach(async () => {
    systemModelStub = {
      isDockerAvailable: sinon.stub()
    };
    dockerDetectedDialogStub = sinon.stub().resolves();
    dockerMissingDialogStub = sinon.stub().resolves();
  });

  it('displays confirmation dialog if docker available', async () => {
    systemModelStub.isDockerAvailable.resolves(true);

    const ret = await call();

    expect(systemModelStub.isDockerAvailable).to.have.been.calledOnce;
    expect(dockerDetectedDialogStub).to.have.been.called;
    expect(dockerMissingDialogStub).to.not.have.been.called;
    expect(ret).to.equal(true);
  });

  it('displays error dialog if not docker available', async () => {
    systemModelStub.isDockerAvailable.resolves(false);

    const ret = await call();

    expect(systemModelStub.isDockerAvailable).to.have.been.calledOnce;
    expect(dockerDetectedDialogStub).to.not.have.been.called;
    expect(dockerMissingDialogStub).to.have.been.called;
    expect(ret).to.equal(false);
  });
});
