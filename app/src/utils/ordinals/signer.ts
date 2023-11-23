import { Network, Psbt, Signer, Transaction } from "bitcoinjs-lib";

export class DummySigner implements Signer {
    publicKey: Buffer;
    constructor(publicKey: Buffer) {
        this.publicKey = publicKey;
    }
    sign(_hash: Buffer, _lowR?: boolean | undefined): Buffer {
        return Buffer.alloc(64, 0);
    }
    signSchnorr(_hash: Buffer): Buffer {
        return Buffer.alloc(64, 0);
    }
}

export interface RemoteSigner {
    getNetwork(): Promise<Network>;
    getPublicKey(): Promise<string>;
    // TODO: rewrite this so we don't have to wait to fetch the tx
    sendToAddress(toAddress: string, amount: number): Promise<string>;
    getTransaction(txId: string): Promise<Transaction>;
    signPsbt(inputIndex: number, psbt: Psbt): Promise<Psbt>;
};
