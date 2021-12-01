/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/
import Dialog from '../models/dialog_model';
import StateModel from '../models/state_model';
import {constants} from 'ambrosus-node-contracts';
import {roleToRoleCode} from '../utils/role_converters';
import messages from '../messages';
import prepareAction from '../menu_actions/prepare_action';
import changeUrlAction from '../menu_actions/change_url_action';
import payoutAction from '../menu_actions/payout_action';
import retireAction from '../menu_actions/retire_action';
import quitAction from '../menu_actions/quit_action';

const actions = {
  [messages.actions.changeUrl]: prepareAction(changeUrlAction(), [constants.ATLAS, constants.HERMES]),
  [messages.actions.payouts]: prepareAction(payoutAction(), [constants.ATLAS]),
  [messages.actions.retire]: prepareAction(retireAction()),
  [messages.actions.quit]: prepareAction(quitAction())
};

const selectActionPhase = async () => {
  const actionSelectionList = Object.keys(actions)
    .filter((key) => actions[key].nodeTypes.includes(roleToRoleCode(StateModel.getDetectedRole())));
  let shouldQuit = false;
  while (!shouldQuit) {
    const {action: selectedAction} = await Dialog.selectActionDialog(actionSelectionList);
    try {
      shouldQuit = await actions[selectedAction].performAction();
    } catch (err) {
      if (err.message.includes('Insufficient funds')) {
        Dialog.insufficientFundsDialog();
      } else {
        Dialog.genericErrorDialog(err.message);
      }
    }
  }
};

export default selectActionPhase;
selectActionPhase();
