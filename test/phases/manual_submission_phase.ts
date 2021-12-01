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

import manualSubmissionPhase from '../../src/phases/manual_submission_phase';
import StateModel from '../../src/models/state_model';
import Dialog from '../../src/models/dialog_model';

chai.use(chaiAsPromised);
chai.use(sinonChai);
const {expect} = chai;

describe('Manual Submission Phase', () => {
  let stateModelStub;

  const exampleSubmission = {
    foo: 'bar'
  };

  const call = manualSubmissionPhase;

  beforeEach(async () => {
    stateModelStub = {
      assembleSubmission: sinon.stub()
    };
    StateModel.assembleSubmission = stateModelStub.assembleSubmission;
    Dialog.displaySubmissionDialog = sinon.stub().resolves();
  });

  it('displays form to send', async () => {
    stateModelStub.assembleSubmission.resolves(exampleSubmission);

    const ret = await call();

    expect(stateModelStub.assembleSubmission).to.have.been.calledOnce;
    expect(Dialog.displaySubmissionDialog).to.have.been.calledWith(exampleSubmission);
    expect(ret).to.deep.equal(exampleSubmission);
  });
});
