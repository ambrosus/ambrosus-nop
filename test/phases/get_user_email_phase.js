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

import getUserEmail from '../../src/phases/get_user_email_phase';

chai.use(chaiAsPromised);
chai.use(sinonChai);
const {expect} = chai;

describe('Get User Email Phase', () => {
  let stateModelStub;
  let askForUserEmailDialogStub;
  let userEmailDetectedDialogStub;

  const exampleEmail = 'amb_node_operator@mail.com';

  const call = async () => getUserEmail(stateModelStub, userEmailDetectedDialogStub, askForUserEmailDialogStub)();

  beforeEach(async () => {
    stateModelStub = {
      getUserEmail: sinon.stub(),
      storeUserEmail: sinon.stub()
    };
    askForUserEmailDialogStub = sinon.stub();
    userEmailDetectedDialogStub = sinon.stub();
  });

  it('ends if a email is already in the store', async () => {
    stateModelStub.getUserEmail.resolves(exampleEmail);

    const ret = await call();

    expect(stateModelStub.getUserEmail).to.have.been.calledOnce;
    expect(askForUserEmailDialogStub).to.have.not.been.called;
    expect(stateModelStub.storeUserEmail).to.have.not.been.called;
    expect(userEmailDetectedDialogStub).to.have.been.calledOnceWith(exampleEmail);
    expect(ret).to.equal(exampleEmail);
  });

  it('stores correctly provided email', async () => {
    stateModelStub.getUserEmail.resolves(null);
    askForUserEmailDialogStub.resolves({
      userEmail: exampleEmail
    });

    const ret = await call();

    expect(stateModelStub.getUserEmail).to.have.been.calledOnce;
    expect(askForUserEmailDialogStub).to.have.been.calledOnce;
    expect(stateModelStub.storeUserEmail).to.have.been.calledOnceWith(exampleEmail);
    expect(userEmailDetectedDialogStub).to.have.been.calledOnceWith(exampleEmail);
    expect(ret).to.equal(exampleEmail);
  });
});
