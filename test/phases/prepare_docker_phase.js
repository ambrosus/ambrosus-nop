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

import prepareDockerPhase from '../../src/phases/prepare_docker_phase';
import {ATLAS_1, APOLLO} from '../../src/consts';

chai.use(chaiAsPromised);
chai.use(sinonChai);
const {expect} = chai;

describe('Prepare Docker Phase', () => {
  let stateModelStub;
  let healthCheckUrlDialogStub;

  const exampleUrl = 'https://hermes-node.com';

  const call = async () => prepareDockerPhase(stateModelStub, healthCheckUrlDialogStub)();

  beforeEach(async () => {
    stateModelStub = {
      getExistingNodeUrl: sinon.stub(),
      getExistingRole: sinon.stub()
    };
    stateModelStub.getExistingNodeUrl.resolves(exampleUrl);
    stateModelStub.getExistingRole.resolves(ATLAS_1);
    healthCheckUrlDialogStub = sinon.stub();
  });

  it('shows node health url after successful installation', async () => {
    await call();
    expect(healthCheckUrlDialogStub).to.be.calledOnceWith(`${exampleUrl}/health`);
  });

  it('does not show health url if url has not been set', async () => {
    stateModelStub.getExistingNodeUrl.resolves(null);

    await call();
    expect(healthCheckUrlDialogStub).to.be.not.called;
  });

  it('does not show health url if role is Apollo', async () => {
    stateModelStub.getExistingRole.resolves(APOLLO);

    await call();
    expect(healthCheckUrlDialogStub).to.be.not.called;
  });
});
