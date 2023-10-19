export type BRC20SummaryDetail = {
  ticker: string;
  overallBalance: string;
  transferableBalance: string;
  availableBalance: string;
};

export type BRC20Info = {
  ticker: string;
  holdersCount: number;
  historyCount: number;
  inscriptionNumber: number;
  inscriptionId: string;
  max: string;
  limit: string;
  minted: string;
  totalMinted: string;
  confirmedMinted: string;
  confirmedMinted1h: string;
  confirmedMinted24h: string;
  mintTimes: number;
  decimal: number;
  creator: string;
  txid: string;
  deployHeight: number;
  deployBlocktime: number;
  completeHeight: number;
  completeBlocktime: number;
  inscriptionNumberStart: number;
  inscriptionNumberEnd: number;
};

type InscriptionRange = {
  height: number;
  total: number;
  start: number;
};

export type BRC20Summary = InscriptionRange & {
  detail: BRC20SummaryDetail[];
};

export type BRC20List = InscriptionRange & {
  detail: BRC20Info[];
};
