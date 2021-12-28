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

import Web3 from 'web3';
import {ATLAS_1, APOLLO, HERMES} from '../../src/consts';
import AtlasModeModel from '../../src/models/atlas_mode_model';
import StateModel from '../../src/models/state_model';
import HttpUtils from '../../src/utils/http_utils';
import Crypto from '../../src/services/crypto';

chai.use(chaiAsPromised);
chai.use(sinonChai);
const {expect} = chai;

const privateKey = '0x4d5db4107d237df6a3d58ee5f70ae63d73d7658d4026f2eefd2f204c81682cb7';

describe('Atlas Mode Model', () => {
  let web3;
  let account;
  let httpUtilsMock;
  let stateModelStub;
  let atlasModeModel;

  before(async () => {
    web3 = new Web3();
    account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;
    Crypto.setAccount(privateKey);
  });

  beforeEach(() => {
    stateModelStub = {
      getRole: sinon.stub(),
      getNodeUrl: sinon.stub()
    };
    StateModel.getRole = stateModelStub.getRole;
    StateModel.getNodeUrl = stateModelStub.getNodeUrl;

    httpUtilsMock = {
      httpPost:  sinon.stub(),
      httpGet: sinon.stub()
    };
    HttpUtils.httpGet = httpUtilsMock.httpGet;
    HttpUtils.httpPost = httpUtilsMock.httpPost;

    atlasModeModel = AtlasModeModel;
  });

  describe('getMode', () => {
    it('returns empty for empty URL', async () => {
      stateModelStub.getRole.resolves(ATLAS_1);
      stateModelStub.getNodeUrl.resolves('');
      const mode = await atlasModeModel.getMode();
      expect(mode).to.be.deep.equal({});
      expect(httpUtilsMock.httpGet).to.not.be.called;
    });

    it('returns empty for APOLLO', async () => {
      stateModelStub.getRole.resolves(APOLLO);
      stateModelStub.getNodeUrl.resolves('http://atlas.ambrosus.io');
      const mode = await atlasModeModel.getMode();
      expect(mode).to.be.deep.equal({});
      expect(httpUtilsMock.httpGet).to.not.be.called;
    });

    it('returns empty for HERMES', async () => {
      stateModelStub.getRole.resolves(HERMES);
      stateModelStub.getNodeUrl.resolves('http://atlas.ambrosus.io');
      const mode = await atlasModeModel.getMode();
      expect(mode).to.be.deep.equal({});
      expect(httpUtilsMock.httpGet).to.not.be.called;
    });

    it('returns "normal" mode by http', async () => {
      stateModelStub.getRole.resolves(ATLAS_1);
      stateModelStub.getNodeUrl.resolves('http://atlas.ambrosus.io');
      httpUtilsMock.httpGet.resolves(JSON.parse('{"mode":{"mode":"normal"}}'));
      const mode = await atlasModeModel.getMode();
      expect(mode).to.be.deep.equal({mode:'normal'});
    });

    it('returns "normal" mode by https', async () => {
      stateModelStub.getRole.resolves(ATLAS_1);
      stateModelStub.getNodeUrl.resolves('https://atlas.ambrosus.io');
      httpUtilsMock.httpGet.resolves(JSON.parse('{"mode":{"mode":"normal"}}'));
      const mode = await atlasModeModel.getMode();
      expect(mode).to.be.deep.equal({mode:'normal'});
    });

    it('returns {} by error', async () => {
      stateModelStub.getRole.resolves(ATLAS_1);
      stateModelStub.getNodeUrl.resolves('https://atlas.ambrosus.io');
      httpUtilsMock.httpGet.throws();
      const mode = await atlasModeModel.getMode();
      expect(mode).to.be.deep.equal({});
    });
  });

  describe('setMode', () => {
    it('returns false for empty URL', async () => {
      stateModelStub.getRole.resolves(ATLAS_1);
      stateModelStub.getNodeUrl.resolves('');
      expect(await atlasModeModel.setMode()).to.be.false;
      expect(httpUtilsMock.httpGet).to.not.be.called;
    });

    it('returns false for APOLLO', async () => {
      stateModelStub.getRole.resolves(APOLLO);
      stateModelStub.getNodeUrl.resolves('http://atlas.ambrosus.io');
      expect(await atlasModeModel.setMode()).to.be.false;
      expect(httpUtilsMock.httpGet).to.not.be.called;
    });

    it('returns false for HERMES', async () => {
      stateModelStub.getRole.resolves(HERMES);
      stateModelStub.getNodeUrl.resolves('http://atlas.ambrosus.io');
      expect(await atlasModeModel.setMode()).to.be.false;
      expect(httpUtilsMock.httpGet).to.not.be.called;
    });

    it('returns false by http error', async () => {
      stateModelStub.getRole.resolves(ATLAS_1);
      stateModelStub.getNodeUrl.resolves('http://atlas.ambrosus.io');
      httpUtilsMock.httpPost.resolves(false);
      expect(await atlasModeModel.setMode('normal')).to.be.false;
      expect(httpUtilsMock.httpPost).to.be.called;
    });

    it('returns false by https error', async () => {
      stateModelStub.getRole.resolves(ATLAS_1);
      stateModelStub.getNodeUrl.resolves('https://atlas.ambrosus.io');
      httpUtilsMock.httpPost.resolves(false);
      expect(await atlasModeModel.setMode('normal')).to.be.false;
      expect(httpUtilsMock.httpPost).to.be.called;
    });
  });

  describe('serializeForHashing', () => {
    it('check serialize', async () => {
      expect(atlasModeModel.serializeForHashing({mode: 'normal',
        createdBy: '0x00a329c0648769A73afAc7F9381E08FB43dBEA72',
        validUntil: 1500010})).to.be.equal('{"createdBy":"0x00a329c0648769A73afAc7F9381E08FB43dBEA72","mode":"normal","validUntil":1500010}');
    });
  });

  describe('createSetModeToken', () => {
    it('create token for normal', async () => {
      expect(await atlasModeModel.createSetModeToken('normal', 10, 1500000000)).to.be.equal('eyJpZERhdGEiOnsiY3JlYXRlZEJ5IjoiMHgwMGEzMjljMDY0ODc2OUE3M2FmQWM3RjkzODFFMDhGQjQzZEJFQTcyIiwibW9kZSI6Im5vcm1hbCIsInZhbGlkVW50aWwiOjE1MDAwMTB9LCJzaWduYXR1cmUiOiIweDBmODVjNjU3YzZhNzBiNTRlMWVhYzk2ZjU5OTU1N2U5YWRhYzU0ZGUyNmY4ZWNhOGE1ODkwZmEyNTViOGVlZWI3NTI0N2Y1ZWMxOTRiYTJlOTAwMzc5ODg1YjRhMGFmZjYzYmIxMzQxMDY0YmRkODFiZjFiYzk0MzZmMzU1OWVhMWMifQ');
    });

    it('create token for retire', async () => {
      expect(await atlasModeModel.createSetModeToken('retire', 10, 1500000000)).to.be.equal('eyJpZERhdGEiOnsiY3JlYXRlZEJ5IjoiMHgwMGEzMjljMDY0ODc2OUE3M2FmQWM3RjkzODFFMDhGQjQzZEJFQTcyIiwibW9kZSI6InJldGlyZSIsInZhbGlkVW50aWwiOjE1MDAwMTB9LCJzaWduYXR1cmUiOiIweDU1OTYyNmIxNGQwNzY3MjM3Y2QyOTYxYTNjNjgxNDE2NzU2ZTQ5ODNlY2QwMjA5MmJhNWYwYzg3MzkzMGViNGUzODE4YTY3MzE1ZjczZjU4NWE4Y2VhMTdjOWUyNTg0OTU0YWMxY2Y2ZmJiNDdjZjFmYTE2MTYwOGQzY2M2ZTkwMWIifQ');
    });
  });
});
