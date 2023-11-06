/**
 * Parking copies of sdk code here until published in bob-sdk
 * TODO: remove code once we have a published sdk version and use their methods instead
 */

import { ElectrsClient } from "@gobob/bob-sdk";
import { Network, Psbt, Transaction } from "bitcoinjs-lib";
import coinSelect from "coinselect";

export interface Wallet {
    // NOTE: for now this should always return the same address
    getAddress(): Promise<string>;
    signPsbt(psbt: Psbt): Promise<Psbt>;
  }
  
  export interface UTXO {
    txid: string
    vout: number,
    value: number,
  }
  
  export interface TxOutTarget {
    address: string,
    value: number
  }
  
  export async function createAndFundTransaction(electrsClient: ElectrsClient, wallet: Wallet, network: Network, txOutputs: Array<TxOutTarget>): Promise<Transaction> {
    const address = await wallet.getAddress();
    const utxos = await getAddressUtxos(electrsClient, address);
  
    const { inputs, outputs } = coinSelect(
        utxos.map(utxo => {
            return {
                txId: utxo.txid,
                vout: utxo.vout,
                value: utxo.value,
            }
        }),
        txOutputs,
        1
    );
  
    if (inputs === undefined) {
      throw Error("No inputs returned/selected by coinSelect");
    }
  
    if (outputs === undefined) {
      throw Error("No outputs returned/selected by coinSelect");
    }
  
    const psbt = new Psbt({ network });
    
    for (const input of inputs) {
        const txHex = await electrsClient.getTransactionHex(input.txId);
        const tx = Transaction.fromHex(txHex);
  
        let witnessUtxo, nonWitnessUtxo;
  
        if (tx.hasWitnesses()) {
            witnessUtxo = {
              script: tx.toBuffer(),
              value: input.value
            };
        } else {
            nonWitnessUtxo = tx.toBuffer();
        }
  
        psbt.addInput({
            hash: input.txId,
            index: input.vout,
            nonWitnessUtxo,
            witnessUtxo,
        });
    }
  
    const changeAddress = await wallet.getAddress();
    outputs.forEach(output => {
        // watch out, outputs may have been added that you need to provide
        // an output address/script for
        if (!output.address) {
            output.address = changeAddress;
        }
  
        psbt.addOutput({
            address: output.address,
            value: output.value,
        })
    });
  
    await wallet.signPsbt(psbt);
    return psbt.extractTransaction();
  }
  
  async function getAddressUtxos(electrsClient: ElectrsClient, address: string, confirmed?: boolean): Promise<Array<UTXO>> {
    const basePath = getBasePath(electrsClient);
    const response = await getJson<Array<{
        txid: string,
        vout: number,
        status: {
            confirmed: boolean,
            block_height: number,
            block_hash: string,
            block_time: number
        },
        value: number,
    }>>(`${basePath}/address/${address}/utxo`);
    return response
        .filter(utxo => (typeof confirmed !== "undefined") ? confirmed === utxo.status.confirmed : true)
        .map<UTXO>(utxo => {
            return {
                txid: utxo.txid,
                vout: utxo.vout,
                value: utxo.value
            }
        });
  }
  
  async function getJson<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await response.json() as Promise<T>;
  }
  
  export async function broadcastTx(electrsClient: ElectrsClient, txHex: string): Promise<string> {
    const basePath = getBasePath(electrsClient);
  
    const res = await fetch(`${basePath}/tx`, {
        method: 'POST',
        body: txHex
    });
    return await res.text();
  }
  
  // not pretty: the info is in there, but we need to pry it out with the "any" crowbar
  function getBasePath(electrsClient: ElectrsClient): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (electrsClient as any).basePath;
  }