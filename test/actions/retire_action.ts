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
import retireAction from '../../src/menu_actions/retire_action';
import {constants} from 'ambrosus-node-contracts';
import Dialog from '../../src/models/dialog_model';
import AtlasModeModel from '../../src/models/atlas_mode_model';
import SmartContractsModel from '../../src/models/smart_contracts_model';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const {expect} = chai;

describe('Retire action', () => {
  let atlasModeModelMock;
  let onboardMock;
  let confirmRetirementDialogStub;
  let continueAtlasRetirementDialogStub;
  let retireActionCall;

  beforeEach(() => {
    confirmRetirementDialogStub = sinon.stub().resolves({retirementConfirmation: true});
    continueAtlasRetirementDialogStub = sinon.stub().resolves({atlasRetirementConfirmation: true});
    Dialog.confirmRetirementDialog  = confirmRetirementDialogStub;
    Dialog.continueAtlasRetirementDialog = continueAtlasRetirementDialogStub;
    Dialog.retirementSuccessfulDialog = sinon.stub().resolves();
    Dialog.retirementStartSuccessfulDialog = sinon.stub().resolves();
    Dialog.retirementContinueDialog = sinon.stub().resolves();
    Dialog.retirementStopDialog = sinon.stub().resolves();
    Dialog.genericErrorDialog = sinon.stub().resolves();
    atlasModeModelMock = {
      getMode: sinon.stub().resolves({mode:'normal'}),
      setMode: sinon.stub().resolves(true)
    };
    AtlasModeModel.getMode = atlasModeModelMock.getMode;
    AtlasModeModel.setMode = atlasModeModelMock.setMode;
    onboardMock = {
      rolesWrapper: {
        onboardedRole: sinon.stub().resolves(constants.APOLLO),
        defaultAddress: '0x1234'
      },
      atlasStakeWrapper: {
        isShelteringAny: sinon.stub().resolves(false),
        defaultAddress: '0x1234'
      },
      retire: sinon.stub().resolves()
    };
    SmartContractsModel.onboardActions = onboardMock;
    retireActionCall = retireAction;
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
    expect(await retireActionCall()).to.be.true;
    expect(onboardMock.retire).to.be.calledOnce;
    expect(Dialog.retirementSuccessfulDialog).to.be.calledAfter(onboardMock.retire);
  });

  it('immediately returns false if confirmation was negative for ATLAS without bundles', async () => {
    onboardMock.rolesWrapper.onboardedRole.resolves(constants.ATLAS),
    confirmRetirementDialogStub.resolves({retirementConfirmation: false});
    expect(await retireActionCall()).to.be.false;
    expect(onboardMock.retire).to.be.not.called;
  });

  it('immediately returns false if confirmation was negative for ATLAS with bundles', async () => {
    onboardMock.rolesWrapper.onboardedRole.resolves(constants.ATLAS),
    onboardMock.atlasStakeWrapper.isShelteringAny.resolves(true),
    confirmRetirementDialogStub.resolves({retirementConfirmation: false});
    expect(await retireActionCall()).to.be.false;
    expect(onboardMock.retire).to.be.not.called;
  });

  it('start retirement and shows success dialog for ATLAS with bundles', async () => {
    onboardMock.rolesWrapper.onboardedRole.resolves(constants.ATLAS),
    onboardMock.atlasStakeWrapper.isShelteringAny.resolves(true),
    confirmRetirementDialogStub.resolves({retirementConfirmation: true});
    expect(await retireActionCall()).to.be.true;
    expect(AtlasModeModel.setMode).to.be.calledOnceWith('retire');
    expect(Dialog.retirementStartSuccessfulDialog).to.be.calledAfter(AtlasModeModel.setMode);
  });

  it('fail to start retirement and shows error dialog for ATLAS with bundles', async () => {
    onboardMock.rolesWrapper.onboardedRole.resolves(constants.ATLAS),
    onboardMock.atlasStakeWrapper.isShelteringAny.resolves(true),
    confirmRetirementDialogStub.resolves({retirementConfirmation: true});
    atlasModeModelMock.setMode.resolves(false),
    expect(await retireActionCall()).to.be.false;
    expect(AtlasModeModel.setMode).to.be.calledOnceWith('retire');
    expect(Dialog.genericErrorDialog).to.be.calledAfter(AtlasModeModel.setMode);
  });

  it('continue retirement and shows continue dialog for ATLAS with bundles', async () => {
    onboardMock.rolesWrapper.onboardedRole.resolves(constants.ATLAS),
    onboardMock.atlasStakeWrapper.isShelteringAny.resolves(true),
    atlasModeModelMock.getMode.resolves({mode:'retire'}),
    continueAtlasRetirementDialogStub.resolves({continueConfirmation: true});
    expect(await retireActionCall()).to.be.true;
    expect(Dialog.retirementContinueDialog).to.be.calledOnce;
  });

  it('stop retirement and shows stop dialog for ATLAS with bundles', async () => {
    onboardMock.rolesWrapper.onboardedRole.resolves(constants.ATLAS),
    onboardMock.atlasStakeWrapper.isShelteringAny.resolves(true),
    atlasModeModelMock.getMode.resolves({mode:'retire'}),
    continueAtlasRetirementDialogStub.resolves({continueConfirmation: false});
    expect(await retireActionCall()).to.be.true;
    expect(AtlasModeModel.setMode).to.be.calledOnceWith('normal');
    expect(Dialog.retirementStopDialog).to.be.calledAfter(AtlasModeModel.setMode);
  });

  it('fail to stop retirement and shows error dialog for ATLAS with bundles', async () => {
    onboardMock.rolesWrapper.onboardedRole.resolves(constants.ATLAS),
    onboardMock.atlasStakeWrapper.isShelteringAny.resolves(true),
    atlasModeModelMock.getMode.resolves({mode:'retire'}),
    continueAtlasRetirementDialogStub.resolves({continueConfirmation: false});
    atlasModeModelMock.setMode.resolves(false),
    expect(await retireActionCall()).to.be.false;
    expect(AtlasModeModel.setMode).to.be.calledOnceWith('normal');
    expect(Dialog.genericErrorDialog).to.be.calledAfter(AtlasModeModel.setMode);
  });
});
