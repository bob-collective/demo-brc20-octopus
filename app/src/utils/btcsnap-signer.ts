import * as ecc from "@bitcoin-js/tiny-secp256k1-asmjs";
import * as retry from "async-retry";
import * as bitcoinjs from "bitcoinjs-lib";
import { address, Network, Psbt, Transaction } from "bitcoinjs-lib";
import { bitcoin, testnet } from "bitcoinjs-lib/src/networks";
import { RemoteSigner, inscribeText } from "@gobob/bob-sdk/dist/ordinals";
import { BitcoinNetwork, BitcoinScriptType, getExtendedPublicKey, getNetworkInSnap, signPsbt } from "./btcsnap-utils";

bitcoinjs.initEccLib(ecc);

// TODO: handle more intelligently
const hardcodedScriptType = BitcoinScriptType.P2PKH;

async function getTxHex(txId: string) {
  return await retry(
    async (bail) => {
      // if anything throws, we retry
      const res = await fetch(
        `https://blockstream.info/testnet/api/tx/${txId}/hex`
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

export class BtcSnapSigner implements RemoteSigner {
  async _getBtcSnapNetwork(): Promise<BitcoinNetwork> {
    return (await getNetworkInSnap()) === "test" ? BitcoinNetwork.Test : BitcoinNetwork.Main;
  }

  async getNetwork(): Promise<Network> {
    try {
      const network = await getNetworkInSnap();
      return network === "test" ? testnet : bitcoin;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getPublicKey(): Promise<string> {
    // TODO: just getting xpub for now, pretty sure it's not what we want here
    const extKey = await getExtendedPublicKey(await this._getBtcSnapNetwork(), hardcodedScriptType);

    return extKey.xpub;
  }

  async sendToAddress(toAddress: string, amount: number): Promise<string> {
    // TODO: figure out how to send bitcoin, remove console.log (added so eslint doesn't complain about unused params)
    console.log(`toAddress: ${toAddress}, amount: ${amount}`);
    throw Error("not implemented yet");
  }

  async getUtxoIndex(toAddress: string, txId: string): Promise<number> {
    const txHex = await getTxHex(txId);
    const tx = Transaction.fromHex(txHex);
    const bitcoinNetwork = await this.getNetwork();
    const scriptPubKey = address.toOutputScript(toAddress, bitcoinNetwork);
    const utxoIndex = tx.outs.findIndex((out) =>
      out.script.equals(scriptPubKey)
    );
    return utxoIndex;
  }

  async signPsbt(_inputIndex: number, psbt: Psbt): Promise<Psbt> {
    // TODO: investigate if we can select input index in btcsnap
    const network = await this._getBtcSnapNetwork();
    const tx = await signPsbt(psbt.toBase64(), network, hardcodedScriptType);
    
    return Psbt.fromHex(tx.txHex);
  }
}

export async function createOrdinal(
  address: string,
  text: string
) {
  const signer = new BtcSnapSigner();
  // fee rate is 1 for testnet
  const tx = await inscribeText(signer, address, 1, text, 546);
  const res = await fetch('https://blockstream.info/testnet/api/tx', {
    method: 'POST',
    body: tx.toHex()
  });
  const txid = await res.text();    
  return txid;
}