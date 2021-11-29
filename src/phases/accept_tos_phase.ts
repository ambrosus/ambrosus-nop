/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.io

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/
import Dialog from '../models/dialog_model';
import StateModel from '../models/state_model';
import SmartContractsModel from '../models/smart_contracts_model';

const acceptTosPhase = () => async () => {
  const existingSignedTos = await StateModel.getSignedTos();
  if (existingSignedTos !== null) {
    return existingSignedTos;
  }
  const tosText = await StateModel.readTosText();
  const {acceptanceSentence} = await Dialog.acceptTosDialog(tosText);
  const acceptedTosText = `${tosText}\n${acceptanceSentence}`;
  await StateModel.createTosFile(acceptedTosText);
  const tosTextHash = SmartContractsModel.hashData(tosText);
  await StateModel.storeTosHash(tosTextHash);
  const privateKey = await StateModel.getPrivateKey();
  const tosSignature = SmartContractsModel.signMessage(acceptedTosText, privateKey);
  await StateModel.storeSignedTos(tosSignature);
};

export default acceptTosPhase;
