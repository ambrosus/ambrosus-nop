/*
Copyright: Ambrosus Technologies GmbH
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

import {
  APOLLO,
  APOLLO_CODE,
  ATLAS_1,
  ATLAS_1_STAKE,
  ATLAS_2,
  ATLAS_2_STAKE, ATLAS_3, ATLAS_3_STAKE,
  ATLAS_CODE,
  HERMES,
  HERMES_CODE, NO_ROLE_CODE
} from '../consts';

const roleToRoleCode = (role) => {
  switch (role) {
    case HERMES:
      return HERMES_CODE;
    case APOLLO:
      return APOLLO_CODE;
    case ATLAS_1:
    case ATLAS_2:
    case ATLAS_3:
      return ATLAS_CODE;
    default:
      return NO_ROLE_CODE;
  }
};

const roleCodeToRole = (roleCode, deposit) => {
  switch (roleCode) {
    case ATLAS_CODE:
      return atlasStakeAmountToRole(deposit);
    case HERMES_CODE:
      return HERMES;
    case APOLLO_CODE:
      return APOLLO;
    default:
      return null;
  }
};

const atlasStakeAmountToRole = (deposit) => {
  switch (deposit) {
    case ATLAS_1_STAKE:
      return ATLAS_1;
    case ATLAS_2_STAKE:
      return ATLAS_2;
    case ATLAS_3_STAKE:
      return ATLAS_3;
    default:
      return null;
  }
};

export {roleToRoleCode, roleCodeToRole};
