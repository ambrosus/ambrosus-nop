/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import chai from 'chai';
import prepareAction from '../../src/menu_actions/prepare_action';

const {expect} = chai;

describe('Prepare action', () => {
  it('returns action object', async () => {
    expect(prepareAction('action', 'nodes')).to.deep.equal({
      performAction: 'action',
      nodeTypes: 'nodes'
    });
  });

  it('show action for all node types by default', async () => {
    expect(prepareAction('action')).to.deep.equal({
      performAction: 'action',
      nodeTypes: ['1', '2', '3']
    });
  });
});
