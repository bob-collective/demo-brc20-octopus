import * as bitcoinjsLib from "bitcoinjs-lib";

const encoder = new TextEncoder();
const MAX_CHUNK_SIZE = 520;

function toXOnly(pubkey: Buffer) {
  return pubkey.subarray(1, 33);
}

export interface Inscription {
  contentType: Buffer;
  content: Buffer;
}

export function createTextInscription(text: string): Inscription {
  const contentType = Buffer.from(encoder.encode("text/plain;charset=utf-8"));
  const content = Buffer.from(encoder.encode(text));
  return { contentType, content };
}

export function createImageInscription(image: Buffer): Inscription {
  const contentType = Buffer.from(encoder.encode("image/jpg"));
  return { contentType, content: image };
}

function chunkContent(data: Buffer) {
  const body: Buffer[] = [];
  let start = 0;
  while (start < data.length) {
    body.push(data.subarray(start, start + MAX_CHUNK_SIZE));
    start += MAX_CHUNK_SIZE;
  }
  return body;
}

function createInscriptionScript(
  xOnlyPublicKey: Buffer,
  inscription: Inscription
) {
  const protocolId = Buffer.from(encoder.encode("ord"));
  return [
    xOnlyPublicKey,
    bitcoinjsLib.opcodes.OP_CHECKSIG,
    bitcoinjsLib.opcodes.OP_0,
    bitcoinjsLib.opcodes.OP_IF,
    protocolId,
    1,
    1,
    inscription.contentType,
    bitcoinjsLib.opcodes.OP_0,
    ...chunkContent(inscription.content),
    bitcoinjsLib.opcodes.OP_ENDIF,
  ];
}

export interface CommitTxData {
  script: (number | Buffer)[];
  scriptTaproot: bitcoinjsLib.payments.Payment;
  outputScript: Buffer;
  tapLeafScript: {
    leafVersion: number;
    script: Buffer;
    controlBlock: Buffer;
  };
}

export function createCommitTxData(
  network: bitcoinjsLib.Network,
  publicKey: Buffer,
  inscription: Inscription
): CommitTxData {
  const xOnlyPublicKey = toXOnly(publicKey);
  const script = createInscriptionScript(xOnlyPublicKey, inscription);

  const outputScript = bitcoinjsLib.script.compile(script);

  const scriptTree = {
    output: outputScript,
    redeemVersion: 192, // 0xc0
  };

  const scriptTaproot = bitcoinjsLib.payments.p2tr({
    internalPubkey: xOnlyPublicKey,
    scriptTree,
    redeem: scriptTree,
    network,
  });

  const cblock = scriptTaproot.witness?.[scriptTaproot.witness.length - 1]!;

  const tapLeafScript = {
    leafVersion: scriptTaproot.redeemVersion!,
    script: outputScript,
    controlBlock: cblock,
  };

  return {
    script,
    scriptTaproot,
    outputScript,
    tapLeafScript,
  };
}

export interface CommitTxResult {
  tx: bitcoinjsLib.Transaction;
  outputIndex: number;
  outputAmount: number;
}
