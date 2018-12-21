/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import changeUrlAction from '../../src/menu_actions/change_url_action';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const {expect} = chai;

describe('Change url action', () => {
  let stateModelMock;
  let rolesWrapperMock;
  let nectarWarningDialogStub;
  let askForNodeUrlDialogStub;
  let confirmationDialogStub;
  let changeUrlSuccessfulDialogStub;
  let changeUrlActionCall;
  const exampleNewUrl = 'http://new-url.com';
  const exampleOldUrl = 'http://old-url.com';
  const exampleAddress = '0xc0ffee';

  beforeEach(() => {
    askForNodeUrlDialogStub = sinon.stub().resolves({nodeUrl: exampleNewUrl});
    confirmationDialogStub = sinon.stub().resolves(true);
    nectarWarningDialogStub = sinon.stub().resolves();
    changeUrlSuccessfulDialogStub = sinon.stub().resolves();
    rolesWrapperMock = {
      setNodeUrl: sinon.stub().resolves()
    };
    stateModelMock = {
      getNodeUrl: sinon.stub().resolves(exampleOldUrl),
      getAddress: sinon.stub().resolves(exampleAddress),
      storeNodeUrl: sinon.stub().resolves()
    };
    changeUrlActionCall = changeUrlAction(stateModelMock, rolesWrapperMock, nectarWarningDialogStub, askForNodeUrlDialogStub, confirmationDialogStub,
      changeUrlSuccessfulDialogStub);
  });

  it(`always returns false, as it never ends NOP`, async () => {
    expect(await changeUrlActionCall()).to.be.false;
  });

  it('shows nectar warning dialog before asking for url input', async () => {
    await changeUrlActionCall();
    expect(nectarWarningDialogStub).to.be.calledBefore(askForNodeUrlDialogStub);
  });

  it('takes new url from dialog and passes it to the roles wrapper', async () => {
    await changeUrlActionCall();
    expect(askForNodeUrlDialogStub).to.be.calledOnce;
    expect(rolesWrapperMock.setNodeUrl).to.be.calledOnceWith(exampleAddress, exampleNewUrl);
  });

  it('updates url in state model', async () => {
    await changeUrlActionCall();
    expect(stateModelMock.storeNodeUrl).to.be.calledOnceWith(exampleNewUrl);
  });

  it('does not perform url change if operation was not confirmed', async () => {
    confirmationDialogStub.resolves(false);
    await changeUrlActionCall();
    expect(rolesWrapperMock.setNodeUrl).to.be.not.called;
    expect(stateModelMock.storeNodeUrl).to.be.not.called;
    expect(changeUrlSuccessfulDialogStub).to.be.not.called;
  });

  it('shows success notification after all actions were performed', async () => {
    await changeUrlActionCall();
    expect(changeUrlSuccessfulDialogStub).to.be.calledAfter(rolesWrapperMock.setNodeUrl);
    expect(changeUrlSuccessfulDialogStub).to.be.calledAfter(stateModelMock.storeNodeUrl);
  });
});
