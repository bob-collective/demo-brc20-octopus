import * as ecc from "@bitcoin-js/tiny-secp256k1-asmjs";
import retry from "async-retry";
import * as bitcoin from "bitcoinjs-lib";
import { BIP32Factory } from "bip32";
import {
  BitcoinNetwork,
  BitcoinScriptType,
  getExtendedPublicKey,
  getMasterFingerprint,
  getNetworkInSnap,
  signInput,
  signPsbt,
  updateNetworkInSnap,
} from "./btcsnap-utils";
import { DefaultElectrsClient, ElectrsClient } from "@gobob/bob-sdk";
import { UTXO, broadcastTx, getAddressUtxos, getFeeRate } from "./sdk-helpers";
import bs58check from "bs58check";
import coinSelect from "coinselect";
import { inscribeData, RemoteSigner } from "./ordinals";
import { DefaultOrdinalsClient, OrdinalsClient } from "./ordinals-client";
import { getTxInscriptions, parseInscriptionId } from "./inscription";
import { Inscription } from "./ordinals/commit";
import { getBlockStreamUrl, getNetworkName } from "./config";

bitcoin.initEccLib(ecc);
const bip32 = BIP32Factory(ecc);

// TODO: revisit if we want to add config, or use script type dynamically
const hardcodedScriptType = BitcoinScriptType.P2WPKH;

const DEFAULT_BIP32_PATH = "m/84'/1'/0'/0/0";

async function getTxHex(txId: string) {
  return await retry(
    async (bail) => {
      // if anything throws, we retry
      const res = await fetch(
        `${getBlockStreamUrl()}/tx/${txId}/hex`
      );

      if (res.status === 403) {
        // don't retry upon 403
        bail(new Error("Unauthorized"));
        throw "Unauthorized";
      } else if (res.status === 404) {
        throw "Could find tx";
      }

      return res.text();
    },
    {
      retries: 20,
      minTimeout: 2000,
      maxTimeout: 5000,
    }
  );
}

export function addressFromExtPubKey(
  xyzpub: string,
  bitcoinNetwork: BitcoinNetwork
) {
  const network =
    bitcoinNetwork === BitcoinNetwork.Test
      ? bitcoin.networks.testnet
      : bitcoin.networks.bitcoin;
  const forcedXpub = anyPubToXpub(xyzpub, network);
  const pubkey = bip32
    .fromBase58(forcedXpub, network)
    .derive(0)
    .derive(0).publicKey;
  return bitcoin.payments.p2wpkh({ pubkey, network }).address;
}

// force x/y/z/v pub key into xpub/tpub format
function anyPubToXpub(xyzpub: string, network: bitcoin.Network) {
  let data = bs58check.decode(xyzpub);
  data = data.subarray(4);

  // force to xpub/tpub format
  const tpubPrefix = "043587cf";
  const xpubPrefix = "0488b21e";
  const prefix = network === bitcoin.networks.testnet ? tpubPrefix : xpubPrefix;

  data = Buffer.concat([Buffer.from(prefix, "hex"), data]);
  return bs58check.encode(data);
}

export class BtcSnapSigner implements RemoteSigner {
  pubKeyHex?: string;
  async _getBtcSnapNetwork(): Promise<BitcoinNetwork> {
    return (await getNetworkInSnap()) === "test"
      ? BitcoinNetwork.Test
      : BitcoinNetwork.Main;
  }

  async getNetwork(): Promise<bitcoin.Network> {
    try {
      const network = await getNetworkInSnap();
      return network === "test"
        ? bitcoin.networks.testnet
        : bitcoin.networks.bitcoin;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getPublicKey(): Promise<string> {
    // poor man's, naive cache. Beware: we need a new signer instance created to "clear" the cached value.
    if (this.pubKeyHex != undefined) {
      return this.pubKeyHex;
    }

    const network = await this.getNetwork();
    if (network === bitcoin.networks.bitcoin) {
      await updateNetworkInSnap(BitcoinNetwork.Test);
    }
    const snapNetwork =
      network === bitcoin.networks.bitcoin
        ? BitcoinNetwork.Main
        : BitcoinNetwork.Test;

    // https://github.com/snapdao/btcsnap/blob/7bad370a45b744b3c108308e75ce7fa2a7a7061f/packages/snap/src/rpc/getExtendedPublicKey.ts#L10-L14
    const extKey = await getExtendedPublicKey(snapNetwork, hardcodedScriptType);

    // extKey.xpub is a vpub with purpose and cointype (mainnet vs testnet) path embedded
    // convert to xpub/tpub before getting pubkey
    const forcedXpub = anyPubToXpub(extKey.xpub, network);

    // child is m/84'/1'/0'/0/0 (same as DEFAULT_BIP32_PATH)
    const pubkey = bip32
      .fromBase58(forcedXpub, network)
      .derive(0)
      .derive(0).publicKey;
    return pubkey.toString("hex");
  }

  async sendToAddress(toAddress: string, amount: number): Promise<string> {
    const network = await this.getNetwork();
    const networkName = getNetworkName(network);
    const electrsClient = new DefaultElectrsClient(networkName);
    const ordinalsClient = new DefaultOrdinalsClient(networkName);

    const senderPubKey = Buffer.from(await this.getPublicKey(), "hex");
    const senderAddress = bitcoin.payments.p2wpkh({
      pubkey: senderPubKey,
      network,
    }).address!;

    const txOutputs = [
      {
        address: toAddress,
        value: amount,
      },
    ];

    const allConfirmedUtxos = await getAddressUtxos(
      electrsClient,
      senderAddress
    );
    const utxos = await findUtxosWithoutInscriptions(
      electrsClient,
      ordinalsClient,
      allConfirmedUtxos
    );

    const { inputs, outputs } = coinSelect(
      utxos.map((utxo) => {
        return {
          txId: utxo.txid,
          vout: utxo.vout,
          value: utxo.value,
        };
      }),
      txOutputs,
      1 // fee rate
    );

    if (inputs === undefined) {
      throw Error("No inputs returned/selected by coinSelect");
    }

    if (outputs === undefined) {
      throw Error("No outputs returned/selected by coinSelect");
    }

    const psbt = new bitcoin.Psbt({ network });

    for (const input of inputs) {
      const txHex = await electrsClient.getTransactionHex(input.txId);
      const utx = bitcoin.Transaction.fromHex(txHex);

      const witnessUtxo = {
        script: utx.outs[input.vout].script,
        value: input.value,
      };
      const nonWitnessUtxo = utx.toBuffer();

      psbt.addInput({
        hash: input.txId,
        index: input.vout,
        nonWitnessUtxo,
        witnessUtxo,
        bip32Derivation: [
          {
            masterFingerprint: Buffer.from(
              (await getMasterFingerprint()) as any,
              "hex"
            ),
            path: DEFAULT_BIP32_PATH,
            pubkey: senderPubKey,
          },
        ],
      });
    }

    const changeAddress = senderAddress;
    outputs.forEach((output) => {
      // output may have been added for change
      if (!output.address) {
        output.address = changeAddress;
      }

      psbt.addOutput({
        address: output.address,
        value: output.value,
      });
    });

    const snapNetwork = await this._getBtcSnapNetwork();
    const txResult = await signPsbt(
      psbt.toBase64(),
      snapNetwork,
      hardcodedScriptType
    );

    return broadcastTx(electrsClient, txResult.txHex);
  }

  async getTransaction(txId: string): Promise<bitcoin.Transaction> {
    const txHex = await getTxHex(txId);
    const tx = bitcoin.Transaction.fromHex(txHex);
    return tx;
  }

  async signPsbt(
    inputIndex: number,
    psbt: bitcoin.Psbt
  ): Promise<bitcoin.Psbt> {
    const network = await this._getBtcSnapNetwork();
    const psbtBase64 = await signInput(
      psbt.toBase64(),
      network,
      hardcodedScriptType,
      inputIndex,
      DEFAULT_BIP32_PATH
    );
    return bitcoin.Psbt.fromBase64(psbtBase64);
  }
}

export async function createOrdinal(address: string, inscription: Inscription, maybeSigner?: BtcSnapSigner) {
  const signer = maybeSigner || new BtcSnapSigner();
  // fee rate is 1 for testnet
  const feeRate = await getFeeRate();
  const tx = await inscribeData(signer, address, feeRate, inscription); // 546
  const res = await fetch(`${getBlockStreamUrl()}/tx`, {
    method: "POST",
    body: tx.toHex(),
  });
  const txid = await res.text();
  return txid;
}

export async function sendInscription(
  address: string,
  inscriptionId: string,
  maybeSigner?: BtcSnapSigner
): Promise<string> {
  const signer = maybeSigner || new BtcSnapSigner();
  // fee rate is 1 for testnet
  const feeRate = await getFeeRate();
  const txid = await transferInscription(signer, address, inscriptionId, feeRate);
  return txid;
}

async function findUtxoForInscriptionId(
  electrsClient: ElectrsClient,
  ordinalsClient: OrdinalsClient,
  utxos: UTXO[],
  inscriptionId: string
): Promise<UTXO | undefined> {
  // TODO: can we get the current UTXO of the inscription from ord?
  // we can use the satpoint for this
  const { txid, index } = parseInscriptionId(inscriptionId);

  for (const utxo of utxos) {
    if (utxo.confirmed) {
      const inscriptionUtxo = await ordinalsClient.getInscriptionFromUTXO(
        `${utxo.txid}:${utxo.vout}`
      );
      if (
        inscriptionUtxo.inscriptions &&
        inscriptionUtxo.inscriptions.includes(inscriptionId)
      ) {
        return utxo;
      }
    } else if (txid == utxo.txid) {
      const inscriptions = await getTxInscriptions(electrsClient, utxo.txid);
      if (typeof inscriptions[index] !== "undefined") {
        return utxo;
      }
    }
  }

  return undefined;
}

// NOTE: will only work for P2WSH
function estimateTxSize(network: bitcoin.Network, toAddress: string) {
  const tx = new bitcoin.Transaction();
  tx.addInput(Buffer.alloc(32, 0), 0);
  tx.ins[0].witness = [Buffer.alloc(71, 0), Buffer.alloc(33, 0)];
  tx.addOutput(bitcoin.address.toOutputScript(toAddress, network), 0);
  return tx.virtualSize();
}

// NOTE: requires higher postage since we don't include cardinals
async function transferInscription(
  signer: BtcSnapSigner,
  toAddress: string,
  inscriptionId: string,
  feeRate: number = 1
): Promise<string> {
  const network = await signer.getNetwork();
  const pubkey = Buffer.from(await signer.getPublicKey(), "hex");
  const fromAddress = bitcoin.payments.p2wpkh({ pubkey, network }).address!;

  const networkName = getNetworkName(network);
  const ordinalsClient = new DefaultOrdinalsClient(networkName);
  const electrsClient = new DefaultElectrsClient(networkName);

  const utxos = await getAddressUtxos(electrsClient, fromAddress);
  const inscriptionUtxo = await findUtxoForInscriptionId(
    electrsClient,
    ordinalsClient,
    utxos,
    inscriptionId
  );

  if (inscriptionUtxo === undefined) {
    throw Error(
      `Unable to find utxo owned by address [${fromAddress}] containing inscription id [${inscriptionId}]`
    );
  }

  const psbt = new bitcoin.Psbt({ network });
  const txHex = await electrsClient.getTransactionHex(inscriptionUtxo.txid);
  const utx = bitcoin.Transaction.fromHex(txHex);

  const witnessUtxo = {
    script: utx.outs[inscriptionUtxo.vout].script,
    value: inscriptionUtxo.value,
  };
  const nonWitnessUtxo = utx.toBuffer();
  const masterFingerprint = Buffer.from(
    (await getMasterFingerprint()) as any,
    "hex"
  );

  // prepare single input
  psbt.addInput({
    hash: inscriptionUtxo.txid,
    index: inscriptionUtxo.vout,
    nonWitnessUtxo,
    witnessUtxo,
    bip32Derivation: [
      {
        masterFingerprint,
        path: DEFAULT_BIP32_PATH,
        pubkey: pubkey,
      },
    ],
  });

  const txSize = estimateTxSize(network, toAddress);
  const fee = txSize * feeRate;

  psbt.addOutput({
    address: toAddress,
    value: inscriptionUtxo.value - fee,
  });

  const snapNetwork =
    network === bitcoin.networks.bitcoin
      ? BitcoinNetwork.Main
      : BitcoinNetwork.Test;
  const tx = await signPsbt(psbt.toBase64(), snapNetwork, hardcodedScriptType);

  return broadcastTx(electrsClient, tx.txHex);
}

/**
 * Given an array of utxos passed in, return those that do not contain any inscriptions.
 */
async function findUtxosWithoutInscriptions(
  electrsClient: ElectrsClient,
  ordinalsClient: OrdinalsClient,
  utxos: UTXO[]
): Promise<UTXO[]> {
  const safeUtxos = [];

  for (const utxo of utxos) {
    if (utxo.confirmed) {
      const inscriptionUtxo = await ordinalsClient.getInscriptionFromUTXO(
        `${utxo.txid}:${utxo.vout}`
      );
      if (inscriptionUtxo.inscriptions.length === 0) {
        safeUtxos.push(utxo);
      }
    } else {
      // we can't use the ord indexer if the tx is unconfirmed
      const inscriptions = await getTxInscriptions(electrsClient, utxo.txid);
      if (inscriptions.length === 0) {
        safeUtxos.push(utxo);
      }
    }
  }

  return safeUtxos;
}
