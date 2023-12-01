// liberally borrowed from https://github.com/bob-collective/demo-unified-assets-tracker/blob/1475ef915518d45103cd4581c3901ede216a6197/ui/src/utils/btcsnap.ts

/* eslint-disable @typescript-eslint/no-explicit-any */
import { MetaMaskInpageProvider } from "@metamask/providers";

// btcsnap code

// errors
export const PsbtValidateErrors = [
  {
    code: 10001,
    name: "InputsDataInsufficient",
    message: "Not all inputs have prev Tx raw hex",
  },
  {
    code: 10002,
    name: "InputsNetworkNotMatch",
    message: "Not every input matches network",
  },
  {
    code: 10003,
    name: "OutputsNetworkNotMatch",
    message: "Not every input matches network",
  },
  {
    code: 10004,
    name: "InputNotSpendable",
    message: "Not all inputs belongs to current account",
  },
  {
    code: 10005,
    name: "ChangeAddressInvalid",
    message: "Change address doesn't belongs to current account",
  },
  {
    code: 10006,
    name: "FeeTooHigh",
    message: "Too much fee",
  },
  {
    code: 10007,
    name: "AmountNotMatch",
    message: "Transaction input amount not match",
  },
];

export const SnapRequestErrors = [
  {
    code: 20000,
    name: "NoPermission",
    message: "Unauthorized to perform action.",
  },
  {
    code: 20001,
    name: "RejectKey",
    message: "User reject to access the key",
  },
  {
    code: 20002,
    name: "RejectSign",
    message: "User reject the sign request",
  },
  {
    code: 20003,
    name: "SignInvalidPath",
    message: "invalid path",
  },
  {
    code: 20004,
    name: "SignFailed",
    message: "Sign transaction failed",
  },
  {
    code: 20005,
    name: "NetworkNotMatch",
    message: "Network not match",
  },
  {
    code: 20006,
    name: "ScriptTypeNotSupport",
    message: "ScriptType is not supported.",
  },
  {
    code: 20007,
    name: "MethodNotSupport",
    message: "Method not found.",
  },
  {
    code: 20008,
    name: "ActionNotSupport",
    message: "Action not supported",
  },
  {
    code: 20009,
    name: "UserReject",
    message: "User rejected the request.",
  },
];

export class BaseError extends Error {
  code: number;
  constructor(code: number) {
    super();
    this.code = code;
  }
  resolve = (fn: () => void) => {
    fn();
  };
}

export class SnapError extends BaseError {
  constructor(message: string) {
    const userFriendlyError = mapErrorToUserFriendlyError(message);
    super(userFriendlyError.code);
    this.name = userFriendlyError.name;
    this.message = userFriendlyError.message;
  }
}

export const mapErrorToUserFriendlyError = (message: string) => {
  const psbtValidateError = PsbtValidateErrors.find((item) =>
    message.startsWith(item.message)
  );
  const snapRequestError = SnapRequestErrors.find((item) =>
    message.startsWith(item.message)
  );

  if (psbtValidateError) {
    switch (psbtValidateError.name) {
      case "FeeTooHigh":
        return { ...psbtValidateError, message: "Fee too high" };
      default:
        return { ...psbtValidateError, message: "Transaction is invalid" };
    }
  }

  if (snapRequestError) {
    switch (snapRequestError.name) {
      case "NoPermission":
        return {
          ...snapRequestError,
          message:
            "This error is usually caused by resetting the recovery phrase, please try to reinstall MetaMask",
        };
      case "SignInvalidPath":
        return { ...snapRequestError, message: "Sign transaction failed" };
      case "ScriptTypeNotSupport":
      case "MethodNotSupport":
      case "ActionNotSupport":
        return { ...snapRequestError, message: "Request error" };
      default:
        return snapRequestError;
    }
  }

  return { message: message, code: 0, name: "UnknownSnapError" };
};

// types
export enum BitcoinNetwork {
  Main = "mainnet",
  Test = "testnet",
}

export enum BitcoinScriptType {
  P2PKH = "P2PKH",
  P2SH_P2WPKH = "P2SH-P2WPKH",
  P2WPKH = "P2WPKH",
}

export enum BitcoinUnit {
  BTC = "BTC",
  Sats = "sats",
  Currency = "Currency",
}

export type Utxo = {
  address: string;
  transactionHash: string;
  index: number;
  value: number;
  pubkey: Buffer;
  rawHex: string;
  path: string;
};

export type Address = {
  address: string | undefined;
  path: string;
  pubkey: Buffer;
};

export enum WalletType {
  BitcoinWallet = "bitcoinWallet",
  LightningWallet = "lightningWallet",
}

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

const { ethereum } = window;

const snapId = "npm:@gobob/btcsnap";

export async function checkConnection(): Promise<boolean> {
  const snaps = await ethereum.request({
    method: "wallet_getSnaps",
  });

  const hasMySnap = Object.keys(snaps || []).includes(snapId);

  return hasMySnap;
}

export async function connect(cb: (connected: boolean) => void) {
  let connected = false;
  try {
    const result: any = await ethereum.request({
      method: "wallet_requestSnaps",
      params: {
        [snapId]: {},
      },
    });

    const hasError = !!result?.snaps?.[snapId]?.error;
    connected = !hasError;
  } finally {
    cb(connected);
  }
}

/**
 *
 * get the extended publicKey from btcsnap
 *
 * @param network
 * @param scriptType
 * @param cb?
 * @returns
 */

export interface ExtendedPublicKey {
  xpub: string;
  mfp: string;
}

export async function getExtendedPublicKey(
  network: BitcoinNetwork,
  scriptType: BitcoinScriptType
): Promise<ExtendedPublicKey> {
  const networkParams = network === BitcoinNetwork.Main ? "main" : "test";

  try {
    return (await ethereum.request({
      method: "wallet_invokeSnap",
      params: {
        snapId,
        request: {
          method: "btc_getPublicExtendedKey",
          params: {
            network: networkParams,
            scriptType,
          },
        },
      },
    })) as ExtendedPublicKey;
  } catch (err: any) {
    const error = new SnapError(
      err?.message || "Get extended public key failed"
    );
    console.error(error);
    throw error;
  }
}

interface AllXpubs {
  mfp: string;
  xpubs: string[];
}

export async function getAllExtendedPublicKeys(): Promise<AllXpubs> {
  try {
    return (await ethereum.request({
      method: "wallet_invokeSnap",
      params: {
        snapId,
        request: {
          method: "btc_getAllXpubs",
          params: {},
        },
      },
    })) as AllXpubs;
  } catch (err: any) {
    const error = new SnapError(
      err?.message || "Get extended public key failed"
    );
    console.error(error);
    throw error;
  }
}

export async function getMasterFingerprint() {
  try {
    return await ethereum.request({
      method: "wallet_invokeSnap",
      params: {
        snapId,
        request: {
          method: "btc_getMasterFingerprint",
        },
      },
    });
  } catch (err: any) {
    const error = new SnapError(
      err?.message || "Snap get master fingerprint failed"
    );
    console.error(error);
    return "";
  }
}

export async function updateNetworkInSnap(network: BitcoinNetwork) {
  const networkParams = network === BitcoinNetwork.Main ? "main" : "test";
  try {
    return await ethereum.request({
      method: "wallet_invokeSnap",
      params: {
        snapId,
        request: {
          method: "btc_network",
          params: {
            action: "set",
            network: networkParams,
          },
        },
      },
    });
  } catch (err: any) {
    const error = new SnapError(err?.message || "Snap set Network failed");
    console.error(error);
    throw error;
  }
}

export async function getNetworkInSnap() {
  try {
    return await ethereum.request({
      method: "wallet_invokeSnap",
      params: {
        snapId,
        request: {
          method: "btc_network",
          params: {
            action: "get",
          },
        },
      },
    });
  } catch (err: any) {
    const error = new SnapError(err?.message || "Get Snap Network failed");
    console.error(error);
    throw error;
  }
}

export async function signPsbt(
  base64Psbt: string,
  network: BitcoinNetwork,
  scriptType: BitcoinScriptType
) {
  const networkParams = network === BitcoinNetwork.Main ? "main" : "test";

  try {
    return (await ethereum.request({
      method: "wallet_invokeSnap",
      params: {
        snapId,
        request: {
          method: "btc_signPsbt",
          params: {
            psbt: base64Psbt,
            network: networkParams,
            scriptType,
          },
        },
      },
    })) as Promise<{ txId: string; txHex: string }>;
  } catch (err: any) {
    const error = new SnapError(err?.message || "Sign PSBT failed");
    console.error(error);
    throw error;
  }
}

export async function signInput(
  base64Psbt: string,
  network: BitcoinNetwork,
  scriptType: BitcoinScriptType,
  inputIndex: number,
  path: string
): Promise<string> {
  const networkParams = network === BitcoinNetwork.Main ? "main" : "test";

  try {
    return (await ethereum.request({
      method: "wallet_invokeSnap",
      params: {
        snapId,
        request: {
          method: "btc_signInput",
          params: {
            psbt: base64Psbt,
            network: networkParams,
            scriptType,
            inputIndex,
            path,
          },
        },
      },
    })) as Promise<any>;
  } catch (err: any) {
    const error = new SnapError(err?.message || "Sign Input failed");
    console.error(error);
    throw error;
  }
}

export enum GetLNWalletDataKey {
  Password = "password",
  Credential = "credential",
  PubKey = "pubkey",
}

export async function getLNWalletData(
  key: GetLNWalletDataKey,
  walletId?: string,
  type?: "get" | "refresh"
) {
  try {
    return await ethereum.request<string>({
      method: "wallet_invokeSnap",
      params: {
        snapId,
        request: {
          method: "btc_getLNDataFromSnap",
          params: {
            key,
            ...(walletId && { walletId }),
            ...(type && { type }),
          },
        },
      },
    });
  } catch (err: any) {
    const error = new SnapError(err?.message || "Get LNWalletData failed");
    console.error(error);
    throw error;
  }
}
export interface SaveLNData {
  walletId: string;
  credential: string;
  password: string;
}

export async function saveLNDataToSnap({
  walletId,
  credential,
  password,
}: SaveLNData) {
  try {
    return await ethereum.request<string>({
      method: "wallet_invokeSnap",
      params: {
        snapId,
        request: {
          method: "btc_saveLNDataToSnap",
          params: {
            walletId,
            credential,
            password,
          },
        },
      },
    });
  } catch (err: any) {
    const error = new SnapError(err?.message || "Save LNData failed");
    console.error(error);
    throw error;
  }
}

export async function signLNInvoice(
  invoice: string
): Promise<string | undefined | null> {
  try {
    return ethereum.request<string>({
      method: "wallet_invokeSnap",
      params: {
        snapId,
        request: {
          method: "btc_signLNInvoice",
          params: {
            invoice,
          },
        },
      },
    });
  } catch (err: any) {
    const error = new SnapError(err?.message || "Sign invoice failed");
    console.error(error);
    throw error;
  }
}
