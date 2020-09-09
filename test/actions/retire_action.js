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

chai.use(sinonChai);
chai.use(chaiAsPromised);
const {expect} = chai;

describe('Retire action', () => {
  let atlasModeModelMock;
  let onboardMock;
  let confirmRetirementDialogStub;
  let retirementSuccessfulDialogStub;
  let continueAtlasRetirementDialogStub;
  let retirementStartSuccessfulDialogStub;
  let retirementContinueDialogStub;
  let retirementStopDialogStub;
  let genericErrorDialogStub;
  let retireActionCall;

  beforeEach(() => {
    confirmRetirementDialogStub = sinon.stub().resolves({retirementConfirmation: true});
    retirementSuccessfulDialogStub = sinon.stub().resolves();
    continueAtlasRetirementDialogStub = sinon.stub().resolves({atlasRetirementConfirmation: true});
    retirementStartSuccessfulDialogStub = sinon.stub().resolves();
    retirementContinueDialogStub = sinon.stub().resolves();
    retirementStopDialogStub = sinon.stub().resolves();
    genericErrorDialogStub = sinon.stub().resolves();
    atlasModeModelMock = {
      getMode: sinon.stub().resolves({mode:'normal'}),
      setMode: sinon.stub().resolves(true)
    };
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
    retireActionCall = retireAction(
      atlasModeModelMock,
      onboardMock,
      confirmRetirementDialogStub,
      retirementSuccessfulDialogStub,
      continueAtlasRetirementDialogStub,
      retirementStartSuccessfulDialogStub,
      retirementContinueDialogStub,
      retirementStopDialogStub,
      genericErrorDialogStub
    );
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
    expect(retirementSuccessfulDialogStub).to.be.calledAfter(onboardMock.retire);
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
    expect(atlasModeModelMock.setMode).to.be.calledOnceWith('retire');
    expect(retirementStartSuccessfulDialogStub).to.be.calledAfter(atlasModeModelMock.setMode);
  });

  it('fail to start retirement and shows error dialog for ATLAS with bundles', async () => {
    onboardMock.rolesWrapper.onboardedRole.resolves(constants.ATLAS),
    onboardMock.atlasStakeWrapper.isShelteringAny.resolves(true),
    confirmRetirementDialogStub.resolves({retirementConfirmation: true});
    atlasModeModelMock.setMode.resolves(false),
    expect(await retireActionCall()).to.be.false;
    expect(atlasModeModelMock.setMode).to.be.calledOnceWith('retire');
    expect(genericErrorDialogStub).to.be.calledAfter(atlasModeModelMock.setMode);
  });

  it('continue retirement and shows continue dialog for ATLAS with bundles', async () => {
    onboardMock.rolesWrapper.onboardedRole.resolves(constants.ATLAS),
    onboardMock.atlasStakeWrapper.isShelteringAny.resolves(true),
    atlasModeModelMock.getMode.resolves({mode:'retire'}),
    continueAtlasRetirementDialogStub.resolves({continueConfirmation: true});
    expect(await retireActionCall()).to.be.true;
    expect(retirementContinueDialogStub).to.be.calledOnce;
  });

  it('stop retirement and shows stop dialog for ATLAS with bundles', async () => {
    onboardMock.rolesWrapper.onboardedRole.resolves(constants.ATLAS),
    onboardMock.atlasStakeWrapper.isShelteringAny.resolves(true),
    atlasModeModelMock.getMode.resolves({mode:'retire'}),
    continueAtlasRetirementDialogStub.resolves({continueConfirmation: false});
    expect(await retireActionCall()).to.be.true;
    expect(atlasModeModelMock.setMode).to.be.calledOnceWith('normal');
    expect(retirementStopDialogStub).to.be.calledAfter(atlasModeModelMock.setMode);
  });

  it('fail to stop retirement and shows error dialog for ATLAS with bundles', async () => {
    onboardMock.rolesWrapper.onboardedRole.resolves(constants.ATLAS),
    onboardMock.atlasStakeWrapper.isShelteringAny.resolves(true),
    atlasModeModelMock.getMode.resolves({mode:'retire'}),
    continueAtlasRetirementDialogStub.resolves({continueConfirmation: false});
    atlasModeModelMock.setMode.resolves(false),
    expect(await retireActionCall()).to.be.false;
    expect(atlasModeModelMock.setMode).to.be.calledOnceWith('normal');
    expect(genericErrorDialogStub).to.be.calledAfter(atlasModeModelMock.setMode);
  });
});
