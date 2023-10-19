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
      `/address/${address}/brc20/summary?start=0&limit=200`
    );
  }

  public getBrc20List() {
    return this.getData<UniSatResponse<BRC20List>>(`/brc-20/list`);
  }
}
