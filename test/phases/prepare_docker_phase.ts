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

import prepareDockerPhase from '../../src/phases/prepare_docker_phase';
import {ATLAS_1, APOLLO} from '../../src/consts';
import StateModel from '../../src/models/state_model';
import Dialog from '../../src/models/dialog_model';

chai.use(chaiAsPromised);
chai.use(sinonChai);
const {expect} = chai;

describe('Prepare Docker Phase', () => {
  let stateModelStub;

  const exampleUrl = 'https://hermes-node.com';

  const call = prepareDockerPhase;

  beforeEach(async () => {
    stateModelStub = {
      getNodeUrl: sinon.stub().resolves(exampleUrl),
      getRole: sinon.stub().resolves(ATLAS_1),
      prepareSetupFiles: sinon.stub()
    };
    StateModel.getNodeUrl = stateModelStub.getNodeUrl;
    StateModel.getRole = stateModelStub.getRole;
    StateModel.prepareSetupFiles = stateModelStub.prepareSetupFiles;

    Dialog.healthCheckUrlDialog = sinon.stub();
  });

  it('prepares setup files', async () => {
    await call();
    expect(stateModelStub.prepareSetupFiles).to.be.calledOnce;
  });

  it('shows node health url after successful installation', async () => {
    await call();
    expect(Dialog.healthCheckUrlDialog).to.be.calledOnce;
  });

  it('does not show health url if url has not been set', async () => {
    stateModelStub.getNodeUrl.resolves(null);

    await call();
    expect(Dialog.healthCheckUrlDialog).to.be.not.called;
  });

  it('does not show health url if role is Apollo', async () => {
    stateModelStub.getRole.resolves(APOLLO);

    await call();
    expect(Dialog.healthCheckUrlDialog).to.be.not.called;
  });
});
