import * as bitcoinjsLib from "bitcoinjs-lib";
import * as psbtUtils from "bitcoinjs-lib/src/psbt/psbtutils";

const { witnessStackToScriptWitness } = psbtUtils;

const encoder = new TextEncoder();

function toXOnly(pubkey: Buffer) {
  return pubkey.subarray(1, 33);
}

interface Inscription {
  contentType: Buffer;
  content: Buffer;
}

function createTextInscription(text: string): Inscription {
  const contentType = Buffer.from(encoder.encode("text/plain;charset=utf-8"));
  const content = Buffer.from(encoder.encode(text));
  return { contentType, content };
}

function createInscriptionScript(xOnlyPublicKey: Buffer, inscription: Inscription) {
  const protocolId = Buffer.from(encoder.encode("ord"));
  return [
    xOnlyPublicKey,
    bitcoinjsLib.opcodes.OP_CHECKSIG,
    bitcoinjsLib.opcodes.OP_0,
    bitcoinjsLib.opcodes.OP_IF,
    protocolId,
    1,
    1, // ISSUE, Buffer.from([1]) is replaced to 05 rather asMinimalOP than 0101 here https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/src/script.js#L53
    // this may not be an issue but it generates a different script address. Unsure if ordinals indexer detect 05 as the content type separator
    inscription.contentType,
    bitcoinjsLib.opcodes.OP_0,
    inscription.content,
    bitcoinjsLib.opcodes.OP_ENDIF,
  ];
}

interface CommitTxData {
  script: (number | Buffer)[];
  revealAddress: string | undefined;
  scriptTaproot: bitcoinjsLib.payments.Payment;
  outputScript: Buffer;
  tapLeafScript: {
    leafVersion: number;
    script: Buffer;
    controlBlock: Buffer;
  }
}

// requires caller to initialize ecc lib
function createCommitTxData(
  network: bitcoinjsLib.Network,
  publicKey: Buffer,
  inscription: Inscription
): CommitTxData {
  const xOnlyPublicKey = toXOnly(publicKey);
  const script = createInscriptionScript(xOnlyPublicKey, inscription);

  const outputScript = bitcoinjsLib.script.compile(script);

  const scriptTree = {
    output: outputScript,
    redeemVersion: 192,
  };

  const scriptTaproot = bitcoinjsLib.payments.p2tr({
    internalPubkey: xOnlyPublicKey,
    scriptTree,
    redeem: scriptTree,
    network,
  });

  const revealAddress = scriptTaproot.address;
  const cblock =
    scriptTaproot.witness?.[scriptTaproot.witness.length - 1].toString("hex")!;

  const tapLeafScript = {
    leafVersion: scriptTaproot.redeemVersion!, // 192 0xc0
    script: outputScript,
    controlBlock: Buffer.from(cblock, "hex"),
  };

  return {
    script,
    revealAddress,
    scriptTaproot,
    outputScript,
    tapLeafScript,
  };
}

interface CommitTxResult {
  txId: string;
  sendUtxoIndex: number;
  sendAmount: number;
}

function createRevealTx(
  network: bitcoinjsLib.Network,
  commitTxData: CommitTxData,
  commitTxResult: CommitTxResult,
  toAddress: string,
  amount: number,
) {
  const { scriptTaproot, tapLeafScript } = commitTxData;

  const psbt = new bitcoinjsLib.Psbt({ network });
  psbt.addInput({
    hash: commitTxResult.txId,
    index: commitTxResult.sendUtxoIndex,
    witnessUtxo: {
      value: commitTxResult.sendAmount,
      script: scriptTaproot.output!,
    },
    tapLeafScript: [tapLeafScript],
  });

  psbt.addOutput({
    value: amount, // generally 1000 for nfts, 549 for brc20
    address: toAddress,
  });

  return psbt;
}

export interface RemoteSigner {
  network(): Promise<bitcoinjsLib.Network>;
  getPublicKey(): Promise<string>;
  sendToAddress(toAddress: string, amount: number): Promise<string>;
  getUtxoIndex(toAddress: string, txId: string): Promise<number>;
  signPsbt(inputIndex: number, psbt: bitcoinjsLib.Psbt): Promise<bitcoinjsLib.Psbt>;
};

async function signRevealTx(
  signer: RemoteSigner,
  commitTxData: CommitTxData,
  psbt: bitcoinjsLib.Psbt
) {
  // reveal should only have one input
  psbt = await signer.signPsbt(0, psbt);

  const { outputScript, tapLeafScript } = commitTxData;

  // we have to construct our witness script in a custom finalizer
  const customFinalizer = (inputIndex: number, input: any) => {
    const witness = [input.tapScriptSig[inputIndex].signature]
      .concat(outputScript)
      .concat(tapLeafScript.controlBlock);

    return {
      finalScriptWitness: witnessStackToScriptWitness(witness),
    };
  };

  // finalize that input
  psbt.finalizeInput(0, customFinalizer);

  return psbt.extractTransaction();
}

class DummySigner implements bitcoinjsLib.Signer {
  publicKey: Buffer;
  constructor(publicKey: Buffer) {
    this.publicKey = publicKey;
  }
  sign(_hash: Buffer, _lowR?: boolean | undefined): Buffer {
    // https://github.com/bitcoin/bitcoin/blob/607d5a46aa0f5053d8643a3e2c31a69bfdeb6e9f/src/script/sign.cpp#L611
    return Buffer.from("304502210100000000000000000000000000000000000000000000000000000000000000000220010000000000000000000000000000000000000000000000000000000000000001", "hex");
  }
  signSchnorr(hash: Buffer): Buffer {
    // https://github.com/bitcoin/bitcoin/blob/607d5a46aa0f5053d8643a3e2c31a69bfdeb6e9f/src/script/sign.cpp#L626
    return Buffer.alloc(64, 0);
  }
}

function estimateTxSize(
  network: bitcoinjsLib.Network,
  publicKey: Buffer,
  commitTxData: CommitTxData,
  toAddress: string,
  amount: number,
) {
  const { outputScript, scriptTaproot, tapLeafScript } = commitTxData;

  const psbt = new bitcoinjsLib.Psbt({ network });
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

  const customFinalizer = (inputIndex: number, input: any) => {
    const witness = [input.tapScriptSig[inputIndex].signature]
      .concat(outputScript)
      .concat(tapLeafScript.controlBlock);
    return {
      finalScriptWitness: witnessStackToScriptWitness(witness),
    };
  };

  psbt.finalizeInput(0, customFinalizer);
  const tx = psbt.extractTransaction();
  return tx.virtualSize();
}

export async function createOrdinal(
  signer: RemoteSigner,
  toAddress: string,
  feeRate: number, // satoshi / byte
  text: string,
  postage = 10000,
) {
  const bitcoinNetwork = await signer.network();
  const publicKey = Buffer.from(await signer.getPublicKey(), "hex");

  const inscription = createTextInscription(text);
  const commitTxData = createCommitTxData(bitcoinNetwork, publicKey, inscription);
  
  const revealTxSize = estimateTxSize(bitcoinNetwork, publicKey, commitTxData, toAddress, postage);

  // https://github.com/ordinals/ord/blob/ea1c7c8f73e1c30df547000ac7ccd82051cb60af/src/subcommand/wallet/inscribe/batch.rs#L501
  const revealFee = revealTxSize * feeRate;
  // https://github.com/ordinals/ord/blob/ea1c7c8f73e1c30df547000ac7ccd82051cb60af/src/subcommand/wallet/inscribe/batch.rs#L327
  const commitTxAmount = revealFee + postage;
  
  const commitAddress = commitTxData.scriptTaproot.address!;
  const commitTxId = await signer.sendToAddress(commitAddress, commitTxAmount);
  const commitUtxoIndex = await signer.getUtxoIndex(commitAddress, commitTxId);

  const commitTxResult = {
    txId: commitTxId,
    sendUtxoIndex: commitUtxoIndex,
    sendAmount: commitTxAmount,
  };

  const revealPsbt = createRevealTx(
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
