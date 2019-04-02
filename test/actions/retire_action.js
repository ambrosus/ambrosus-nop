/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import retireAction from '../../src/menu_actions/retire_action';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const {expect} = chai;

describe('Retire action', () => {
  let onboardMock;
  let confirmRetirementDialogStub;
  let retirementSuccessfulDialogStub;
  let retireActionCall;

  beforeEach(() => {
    confirmRetirementDialogStub = sinon.stub().resolves({retirementConfirmation: true});
    retirementSuccessfulDialogStub = sinon.stub().resolves();
    onboardMock = {
      retire: sinon.stub().resolves()
    };
    retireActionCall = retireAction(onboardMock, confirmRetirementDialogStub, retirementSuccessfulDialogStub);
  });

  it(`returns true and ends NOP on successful retirement`, async () => {
    expect(await retireActionCall()).to.be.true;
  });

  it('immediately returns false if confirmation was negative', async () => {
    confirmRetirementDialogStub.resolves({retirementConfirmation: false});
    expect(await retireActionCall()).to.be.false;
    expect(onboardMock.retire).to.be.not.called;
  });

  it('shows success dialog after retirement', async () => {
    await retireActionCall();
    expect(onboardMock.retire).to.be.calledOnce;
    expect(retirementSuccessfulDialogStub).to.be.calledAfter(onboardMock.retire);
  });
});
