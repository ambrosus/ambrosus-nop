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
import System from '../../src/services/system';

chai.use(chaiAsPromised);
chai.use(sinonChai);
const {expect} = chai;

describe('System', () => {
  let execCmdStub;

  beforeEach(async () => {
    execCmdStub = sinon.stub();
    System.execCmd = execCmdStub;
  });

  describe('isDockerAvailable', () => {
    it('expects the cmd to return with status code 0 and the docker version string', async () => {
      execCmdStub.resolves({stdout: 'Docker version 18.06.0-ce, build 0ffa825\n', stderr: ''});
      await expect(System.isDockerAvailable()).to.be.eventually.fulfilled.with.true;
    });

    it('detects status code other then 0', async () => {
      execCmdStub.rejects({err: 'Command not found', stdout: 'Docker version 18.06.0-ce, build 0ffa825\n', stderr: ''});
      await expect(System.isDockerAvailable()).to.be.eventually.fulfilled.with.false;
    });
  });
});
