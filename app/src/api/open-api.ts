import { ApiService } from "./api-service";
import { BRC20List, BRC20Summary } from "./types";

type UniSatResponse<T> = {
  code: number;
  msg: string;
  data: T;
};

export class OpenAPIService extends ApiService {
  constructor() {
    super("http://localhost:3000/api");
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
}
