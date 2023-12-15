/**
 * Parking copies of sdk code here until published in bob-sdk
 * TODO: remove code once we have a published sdk version and use their methods instead
 */

import { ElectrsClient } from "@gobob/bob-sdk";
import { OrdinalsClient } from "./ordinals-client";
import * as bitcoin from "bitcoinjs-lib";
import { parseInscriptions } from "./inscription";
import { getBlockStreamUrl } from "./config";

export interface UTXO {
  txid: string
  vout: number,
  value: number,
  confirmed: boolean,
  height?: number
}

export interface TxOutTarget {
  address: string,
  value: number
}

export async function getInscriptionIds(electrsClient: ElectrsClient, ordinalsClient: OrdinalsClient, bitcoinAddress: string) {
  const utxos = await getAddressUtxos(electrsClient, bitcoinAddress);
  const inscriptionIds = await Promise.all(
    utxos.sort((a, b) => {
      // force large number if height is not available (as expected for unconfirmed utxo)
      const heightA = a.height || Number.MAX_SAFE_INTEGER;
      const heightB = b.height || Number.MAX_SAFE_INTEGER;

      return heightA - heightB;
    })
      .map(utxo => getInscriptionIdsForUtxo(electrsClient, ordinalsClient, utxo))
  );
  return inscriptionIds.flat();
}

async function getInscriptionIdsForUtxo(electrsClient: ElectrsClient, ordinalsClient: OrdinalsClient, utxo: UTXO) {
  if (utxo.confirmed) {
    // use ord api if the tx has been included in a block
    const inscriptionUtxo = await ordinalsClient.getInscriptionFromUTXO(`${utxo.txid}:${utxo.vout}`);
    return inscriptionUtxo.inscriptions;
  }

  const txHex = await electrsClient.getTransactionHex(utxo.txid);
  const tx = bitcoin.Transaction.fromHex(txHex);

  // NOTE: assumes inscriptions are always sent to the first output
  // which is not always the case
  if (utxo.vout == 0) {
    // this handles the case where we have just transferred an inscription
    // but the ordinal indexer has not yet confirmed it so we check if the
    // parent utxo has an inscription instead
    // NOTE: this won't work if the parent UTXO is not included in a block
    const parentInscriptions = await Promise.all(tx.ins.map(async txInput => {
      const txid = txInput.hash.reverse().toString("hex");
      const inscriptionUtxo = await ordinalsClient.getInscriptionFromUTXO(`${txid}:${txInput.index}`);
      return inscriptionUtxo.inscriptions;
    }));
    const inscriptionIds = parentInscriptions.flat();
    if (inscriptionIds.length > 0) {
      return inscriptionIds;
    }
  }

  // otherwise parse the inscriptions manually
  const inscriptions = parseInscriptions(tx);
  // inscription is made on the first sat of the first output
  if (utxo.vout != 0) {
    return [];
  } else {
    // NOTE: it is probably possible for the inscription to be invalid
    // if the sat is already inscribed but the chances of that are low
    return inscriptions.map((_, index) => `${utxo.txid}i${index}`);
  }
}

export async function getAddressUtxos(electrsClient: ElectrsClient, address: string, confirmed?: boolean): Promise<Array<UTXO>> {
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
        value: utxo.value,
        confirmed: utxo.status.confirmed,
        height: utxo.status.block_height
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

export async function getFeeRate(): Promise<number> {
  const res = await fetch(`${getBlockStreamUrl()}/fee-estimates`);
  const feeRates = await res.json();
  return feeRates["6"]; // one hour
}