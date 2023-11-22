import { useLocalStorage as useLibLocalStorage } from "react-use";

enum LocalStorageKey {
  DERIVED_BTC_ADDRESS = "DERIVED_BTC_ADDRESS",
}

type LocalStorageValueTypes = {
  [LocalStorageKey.DERIVED_BTC_ADDRESS]: string;
};

type Options<T = unknown> =
  | {
      raw: true;
    }
  | {
      raw: false;
      serializer: (value: T) => string;
      deserializer: (value: string) => T;
    }
  | undefined;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useLocalStorage = <T extends keyof LocalStorageValueTypes>(
  key: T,
  initialValue?: LocalStorageValueTypes[T],
  options?: Options<LocalStorageValueTypes[T]>
) => useLibLocalStorage<LocalStorageValueTypes[T]>(key, initialValue, options);

export { LocalStorageKey, useLocalStorage };
