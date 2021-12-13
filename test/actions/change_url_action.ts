/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import Dialog from '../../src/models/dialog_model';
import StateModel from '../../src/models/state_model';
import SmartContractsModel from '../../src/models/smart_contracts_model';
import changeUrlAction from '../../src/menu_actions/change_url_action';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const {expect} = chai;

describe('Change url action', () => {
  let confirmationDialogStub;
  let changeUrlActionCall;
  const exampleNewUrl = 'http://new-url.com';
  const exampleOldUrl = 'http://old-url.com';
  const exampleAddress = '0xc0ffee';

  beforeEach(() => {
    confirmationDialogStub = sinon.stub().resolves(true);
    Dialog.changeUrlConfirmationDialog = confirmationDialogStub;
    Dialog.askForNodeUrlDialog = sinon.stub().resolves({nodeUrl: exampleNewUrl});
    Dialog.nectarWarningDialog = sinon.stub().resolves();
    Dialog.changeUrlSuccessfulDialog = sinon.stub().resolves();
    SmartContractsModel.rolesWrapper = {
      setNodeUrl: sinon.stub().resolves()
    };
    StateModel.getNodeUrl = sinon.stub().resolves(exampleOldUrl);
    StateModel.getAddress = sinon.stub().resolves(exampleAddress);
    StateModel.storeNodeUrl = sinon.stub().resolves();
    changeUrlActionCall = changeUrlAction();
  });

  it(`always returns false, as it never ends NOP`, async () => {
    expect(await changeUrlActionCall()).to.be.false;
  });

  it('shows nectar warning dialog before asking for url input', async () => {
    await changeUrlActionCall();
    expect(Dialog.nectarWarningDialog).to.be.calledBefore(Dialog.askForNodeUrlDialog);
  });

  it('takes new url from dialog and passes it to the roles wrapper', async () => {
    await changeUrlActionCall();
    expect(Dialog.askForNodeUrlDialog).to.be.calledOnce;
    expect(SmartContractsModel.rolesWrapper.setNodeUrl).to.be.calledOnceWith(exampleAddress, exampleNewUrl);
  });

  it('updates url in state model', async () => {
    await changeUrlActionCall();
    expect(StateModel.storeNodeUrl).to.be.calledOnceWith(exampleNewUrl);
  });

  it('does not perform url change if operation was not confirmed', async () => {
    confirmationDialogStub.resolves(false);
    await changeUrlActionCall();
    expect(SmartContractsModel.rolesWrapper.setNodeUrl).to.be.not.called;
    expect(StateModel.storeNodeUrl).to.be.not.called;
    expect(Dialog.changeUrlSuccessfulDialog).to.be.not.called;
  });

  it('shows success notification after all actions were performed', async () => {
    await changeUrlActionCall();
    expect(Dialog.changeUrlSuccessfulDialog).to.be.calledAfter(SmartContractsModel.rolesWrapper.setNodeUrl);
    expect(Dialog.changeUrlSuccessfulDialog).to.be.calledAfter(StateModel.storeNodeUrl);
  });
});
