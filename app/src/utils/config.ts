import * as bitcoin from "bitcoinjs-lib";
import { MAINNET_ORD_BASE_PATH, TESTNET_ORD_BASE_PATH } from "./ordinals-client";

export const BITCOIN_NETWORK = import.meta.env.VITE_BITCOIN_NETWORK as string;

export const getNetworkName = (network: bitcoin.Network) => {
    return network === bitcoin.networks.testnet ? "testnet" : "mainnet";
}

export const getOrdinalsUrl = () => {
    if (BITCOIN_NETWORK === "testnet") {
        return TESTNET_ORD_BASE_PATH;
    }
    if (BITCOIN_NETWORK === "mainnet") {
        return MAINNET_ORD_BASE_PATH;
    }
    throw new Error(
        `Invalid bitcoin network configured: ${BITCOIN_NETWORK}. Valid values are: testnet | mainnet.`
    );
};

export const getBlockStreamUrl = () => {
    if (BITCOIN_NETWORK === "testnet") {
        return "https://blockstream.info/testnet/api";
    }
    if (BITCOIN_NETWORK === "mainnet") {
        return "https://blockstream.info/api";
    }
    throw new Error(
        `Invalid bitcoin network configured: ${BITCOIN_NETWORK}. Valid values are: testnet | mainnet.`
    );
};
