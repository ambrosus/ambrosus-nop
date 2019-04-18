/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/
const acceptTosPhase = (stateModel, smartContractsModel, acceptTosDialog) => async () => {
  const existingSignedTos = await stateModel.getSignedTos();
  if (existingSignedTos !== null) {
    return existingSignedTos;
  }
  const tosText = await stateModel.readTosText();
  const {acceptanceSentence} = await acceptTosDialog(tosText);
  const acceptedTosText = `${tosText}\n${acceptanceSentence}`;
  await stateModel.createTosFile(acceptedTosText);
  const privateKey = await stateModel.getPrivateKey();
  const signedTos = smartContractsModel.signMessage(acceptedTosText, privateKey);
  await stateModel.storeSignedTos(signedTos);
};

export default acceptTosPhase;
