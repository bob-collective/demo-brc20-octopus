import * as bitcoinjsLib from "bitcoinjs-lib";

import { DummySigner, RemoteSigner } from "./signer";
import { CommitTxData, Inscription, createCommitTxData } from "./commit";
import { createRevealTx, customFinalizer, signRevealTx } from "./reveal";

export type { RemoteSigner };

function estimateTxSize(
  network: bitcoinjsLib.Network,
  publicKey: Buffer,
  commitTxData: CommitTxData,
  toAddress: string,
  amount: number,
) {
  const psbt = new bitcoinjsLib.Psbt({ network });

  const { scriptTaproot, tapLeafScript } = commitTxData;
  psbt.addInput({
    hash: Buffer.alloc(32, 0),
    index: 0,
    witnessUtxo: {
      value: amount,
      script: scriptTaproot.output!,
    },
    tapLeafScript: [tapLeafScript],
  });

  psbt.addOutput({
    value: amount,
    address: toAddress,
  });

  psbt.signInput(0, new DummySigner(publicKey));
  psbt.finalizeInput(0, customFinalizer(commitTxData));

  const tx = psbt.extractTransaction();
  return tx.virtualSize();
}

export async function inscribeData(
  signer: RemoteSigner,
  _toAddress: string,
  feeRate: number,
  inscription: Inscription,
  postage = 10000,
) {
  const bitcoinNetwork = await signer.getNetwork();
  const publicKey = Buffer.from(await signer.getPublicKey(), "hex");

  const toAddress = bitcoinjsLib.payments.p2wpkh({ pubkey: publicKey, network: bitcoinNetwork }).address!;

  const commitTxData = createCommitTxData(bitcoinNetwork, publicKey, inscription);

  const revealTxSize = estimateTxSize(bitcoinNetwork, publicKey, commitTxData, toAddress, postage);

  const revealFee = revealTxSize * feeRate;
  const commitTxAmount = revealFee + postage;

  const commitAddress = commitTxData.scriptTaproot.address!;
  const commitTxId = await signer.sendToAddress(commitAddress, commitTxAmount);
  const commitTx = await signer.getTransaction(commitTxId);

  const scriptPubKey = bitcoinjsLib.address.toOutputScript(commitAddress, bitcoinNetwork);
  const commitUtxoIndex = commitTx.outs.findIndex((out) =>
    out.script.equals(scriptPubKey)
  );

  const commitTxResult = {
    tx: commitTx,
    outputIndex: commitUtxoIndex,
    outputAmount: commitTxAmount,
  };

  const revealPsbt = await createRevealTx(
    bitcoinNetwork,
    commitTxData,
    commitTxResult,
    toAddress,
    postage,
  );

  const revealTx = await signRevealTx(
    signer,
    commitTxData,
    revealPsbt
  );

  return revealTx;
}
