import * as ecc from "@bitcoin-js/tiny-secp256k1-asmjs";
import * as retry from "async-retry";
import * as bitcoinjs from "bitcoinjs-lib";
import { BIP32Factory } from "bip32";
import { address, Network, Psbt, Transaction } from "bitcoinjs-lib";
import { bitcoin, testnet } from "bitcoinjs-lib/src/networks";
import { RemoteSigner, inscribeText } from "@gobob/bob-sdk/dist/ordinals";
import { BitcoinNetwork, BitcoinScriptType, getExtendedPublicKey, getNetworkInSnap, signPsbt } from "./btcsnap-utils";
import { DefaultElectrsClient } from "@gobob/bob-sdk";
import { broadcastTx, createAndFundTransaction } from "./sdk-helpers";

bitcoinjs.initEccLib(ecc);
const bip32 = BIP32Factory(ecc);

// TODO: revisit if we want to add config, or use script type dynamically
const hardcodedScriptType = BitcoinScriptType.P2WPKH;

function getDerivationPurpose(scriptType: BitcoinScriptType): string {
  switch (scriptType) {
    case BitcoinScriptType.P2PKH:
      return "44";
    case BitcoinScriptType.P2SH_P2WPKH:
      return "49";
    case BitcoinScriptType.P2WPKH:
      return "84";
    default:
      throw Error(`Missing purpose definition for script type: ${scriptType}`);
  }
}

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
    const network = await this.getNetwork();
    const snapNetwork = network === bitcoin ? BitcoinNetwork.Main : BitcoinNetwork.Test;

    const extKey = await getExtendedPublicKey(snapNetwork, hardcodedScriptType);

    const purpose = getDerivationPurpose(hardcodedScriptType);
    // bitcoin or testnet (0 or 1)
    const coinType = network === testnet ? "1" : "0";
    // account index
    const account = "0";
    // receive (0) or change (1)
    const change = "0";
    const path = `m/${purpose}'/${coinType}'/${account}'/${change}`;

    // getExtendedPublicKey returns xpub in base58
    const pubkey = bip32.fromBase58(extKey.xpub, network).derivePath(path).publicKey;
    // TODO: check if this needs to be returned in a different format
    return pubkey.toString("hex");
  }

  async sendToAddress(toAddress: string, amount: number): Promise<string> {
    // TODO: this needs bob-sdk version that includes the changes from this PR: https://github.com/bob-collective/bob/pull/80
    // currently using copied methods
    const network = await this.getNetwork();
    const networkName = network === testnet ? "testnet" : "mainnet";
    const electrsClient = new DefaultElectrsClient(networkName);

    const senderPubKey = Buffer.from(await this.getPublicKey(), "hex");
    const senderAddress = bitcoinjs.payments.p2wpkh({pubkey: senderPubKey}).address!;

    const output = {
      address: toAddress,
      value: amount
    };

    // create wallet w. interfaces
    const wallet = {
      getAddress: () => Promise.resolve(senderAddress),
      signPsbt: (psbt: Psbt) => this.signPsbt(0, psbt),
    }

    // below needs draft pr to be merged and newer version tagged
    const tx = await createAndFundTransaction(electrsClient, wallet, network, [output]);

    return broadcastTx(electrsClient, tx.toHex());
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