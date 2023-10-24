import { ApiService } from "./api-service";
import { BRC20List, BRC20Summary, InscriptionUTXOData } from "./types";

type UniSatResponse<T> = {
  code: number;
  msg: string;
  data: T;
};

export class OpenAPIService extends ApiService {
  constructor() {
    super(import.meta.env.VITE_API_URL);
  }

  public getBrc20Summary(address: string) {
    return this.getData<UniSatResponse<BRC20Summary>>(
      `/address/${address}/brc-20/balance`
    );
  }

  public getBrc20List(type: "all" | "in-progress" | "completed") {
    const sort =
      type === "all" ? "deploy" : type === "in-progress" ? "minted" : "deploy";
    const complete =
      type === "all" ? "" : type === "in-progress" ? "no" : "yes";

    return this.getData<UniSatResponse<BRC20List>>(
      `/brc-20/list?sort=${sort}&complete=${complete}`
    );
  }

  public getAddressInscriptionUTXO(address: string) {
    return this.getData<UniSatResponse<InscriptionUTXOData>>(
      `/address/${address}/inscription-utxo-data`
    );
  }
}
