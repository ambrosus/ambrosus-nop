/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/


import BN from 'bn.js';
import utils from './utils/web3_utils';

export const APOLLO_CODE = '3';
export const HERMES_CODE = '2';
export const ATLAS_CODE = '1';

export const APOLLO = 'Apollo';
export const HERMES = 'Hermes';
export const ATLAS_1 = 'Atlas Zeta';
export const ATLAS_2 = 'Atlas Sigma';
export const ATLAS_3 = 'Atlas Omega';

export const ATLAS_1_STAKE = (utils.toWei(new BN(10000))).toString();
export const ATLAS_2_STAKE = (utils.toWei(new BN(30000))).toString();
export const ATLAS_3_STAKE = (utils.toWei(new BN(75000))).toString();
