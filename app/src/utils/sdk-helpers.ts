/**
 * Parking copies of sdk code here until published in bob-sdk
 * TODO: remove code once we have a published sdk version and use their methods instead
 */

import { ElectrsClient } from "@gobob/bob-sdk";

export interface UTXO {
  txid: string
  vout: number,
  value: number,
}

export interface TxOutTarget {
  address: string,
  value: number
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