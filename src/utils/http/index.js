// @flow

import request from "request";
import { createHttpClient } from "./api";

type RequestOptions = { [string]: mixed };
type RequestResponse = any;

export interface IHttpClientModule {
  get(string, ?RequestOptions): Promise<RequestResponse>;
  del(string, ?RequestOptions): Promise<RequestResponse>;
  post(string, JsonValue, ?RequestOptions): Promise<RequestResponse>;
  put(string, JsonValue, ?RequestOptions): Promise<RequestResponse>;
}

export const api = createHttpClient({ request });
