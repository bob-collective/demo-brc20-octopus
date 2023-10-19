import axios from "axios";

export class ApiService {
  private http: string;

  constructor(http: string) {
    this.http = http;
  }

  public getData<T>(path: string) {
    return axios.get<T>(`${this.http}${path}`);
  }
}
