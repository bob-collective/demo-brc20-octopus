import { createOrdinal, RemoteSigner } from "sdk/src/ordinals";
import { Network, Psbt, Transaction, address } from "bitcoinjs-lib";
import { bitcoin, testnet } from "bitcoinjs-lib/src/networks";
import * as ecc from '@bitcoin-js/tiny-secp256k1-asmjs';
import * as bitcoinjs from "bitcoinjs-lib";
import * as retry from "async-retry";

bitcoinjs.initEccLib(ecc);

async function getTxHex(txId: string) {
  return await retry(
    async (bail) => {
      // if anything throws, we retry
      const res = await fetch(`https://blockstream.info/testnet/api/tx/${txId}/hex`);
  
      if (res.status === 403) {
        // don't retry upon 403
        bail(new Error('Unauthorized'));
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

class UniSatSigner implements RemoteSigner {
  async network(): Promise<Network> {
      switch (await window.unisat.getNetwork()) {
        case "livenet":
          return bitcoin;
        case "testnet":
          return testnet;
        default:
          throw new Error("Unknown network");
      }
  }

  async getPublicKey(): Promise<string> {
      return window.unisat.getPublicKey();
  }

  async sendToAddress(toAddress: string, amount: number): Promise<string> {
    const txid = await window.unisat.sendBitcoin(toAddress, amount);
    return txid;
  }

  async getUtxoIndex(toAddress: string, txId: string): Promise<number> {
    const txHex = await getTxHex(txId);
    const tx = Transaction.fromHex(txHex);
    const bitcoinNetwork = await this.network();
    const scriptPubKey = address.toOutputScript(toAddress, bitcoinNetwork);
    const utxoIndex = tx.outs.findIndex(out => out.script.equals(scriptPubKey));
    return utxoIndex;
  }

  async signPsbt(inputIndex: number, psbt: Psbt): Promise<Psbt> {
    const publicKey = await this.getPublicKey();
    const psbtHex = await window.unisat.signPsbt(psbt.toHex(), {
      autoFinalized: false,
      toSignInputs: [
        {
          index: inputIndex,
          publicKey,
          disableTweakSigner: true,
        }
      ]
    });
    return Psbt.fromHex(psbtHex);
  }
}

export async function submitOrdinal(text: string) {
    const accounts = await window.unisat.getAccounts();
    const signer = new UniSatSigner();
    const tx = await createOrdinal(signer, accounts[0], text);
    const res = await fetch('https://blockstream.info/testnet/api/tx', {
      method: 'POST',
      body: tx.toHex()
    });
    const txid = await res.text();    
    return txid;
}