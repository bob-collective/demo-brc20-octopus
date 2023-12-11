// TODO: Copied from bob-sdk, remove this file once merged and published and import the sdk's client instead

export const TESTNET_ORD_BASE_PATH = "https://ordinals-testnet.gobob.xyz";
export const MAINNET_ORD_BASE_PATH = "https://ordinals-mainnet.gobob.xyz";

export type InscriptionId = string & { length: 64 };
export type InscriptionContent = string;

export interface InscriptionsData {
    inscriptions: InscriptionContent[];
    prev: string;
    next: string;
    lowest: number;
    highest: number;
}

export interface InscriptionUTXO {
    value: number;
    script_pubkey: string;
    address: string;
    transaction: string;
    sat_ranges: string;
    inscriptions: InscriptionContent[];
    runes: Record<string, any>;
}

export interface Ordinal {
    number: number;
    decimal: string;
    degree: string;
    name: string;
    block: number;
    cycle: number;
    epoch: number;
    period: number;
    offset: number;
    rarity: string;
    percentile: string;
    satpoint: string;
    timestamp: number;
    inscriptions: InscriptionContent[];
}

export interface InscriptionDataFromId {
    address: string;
    children: string[];
    content_length: number;
    content_type: string;
    genesis_fee: number;
    genesis_height: number;
    inscription_id: string;
    inscription_number: number;
    next: string;
    output_value: number;
    parent: string;
    previous: string;
    rune: string;
    sat: string;
    satpoint: string;
    timestamp: number;
}


export interface OrdinalsClient {
    getInscriptionFromId(id: InscriptionId): Promise<InscriptionDataFromId>;
    getInscriptions(): Promise<InscriptionsData>;
    getInscriptionsFromBlock(height: number): Promise<InscriptionsData>;
    getInscriptionFromUTXO(utxo: string): Promise<InscriptionUTXO>;
    getInscriptionsFromSat(sat: number): Promise<Ordinal>;
    getInscriptionsFromStartBlock(startHeight: number): Promise<InscriptionsData>;
}

export class DefaultOrdinalsClient implements OrdinalsClient {
    private basePath: string;

    constructor(networkOrUrl: string = "regtest") {
        switch (networkOrUrl) {
            case "testnet":
                this.basePath = TESTNET_ORD_BASE_PATH;
                break;
            case "mainnet":
                this.basePath = MAINNET_ORD_BASE_PATH;
                break;
            default:
                this.basePath = networkOrUrl;
        }
    }

    async getInscriptionFromId(id: InscriptionId): Promise<InscriptionDataFromId> {
        return await this.getJson<InscriptionDataFromId>(`${this.basePath}/inscription/${id}`);
    }

    async getInscriptions(): Promise<InscriptionsData> {
        return await this.getJson<InscriptionsData>(`${this.basePath}/inscriptions`);
    }

    async getInscriptionsFromBlock(height: number): Promise<InscriptionsData> {
        return await this.getJson<InscriptionsData>(`${this.basePath}/inscriptions/block/${height}`);
    }

    async getInscriptionFromUTXO(utxo: string): Promise<InscriptionUTXO> {
        return await this.getJson<InscriptionUTXO>(`${this.basePath}/output/${utxo}`);
    }

    async getInscriptionsFromSat(sat: number): Promise<Ordinal> {
        return await this.getJson<Ordinal>(`${this.basePath}/sat/${sat}`);
    }

    async getInscriptionsFromStartBlock(startHeight: number): Promise<InscriptionsData> {
        return await this.getJson<InscriptionsData>(`${this.basePath}/inscriptions/${startHeight}`);
    }

    async getJson<T>(url: string): Promise<T> {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return await response.json() as Promise<T>;
    }
}