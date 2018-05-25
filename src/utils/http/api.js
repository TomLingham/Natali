// @flow

import typeof request from "request";
import type { IHttpClientModule } from ".";

type Dependencies = {
  request: request
};

export function createHttpClient({ request }: Dependencies): IHttpClientModule {
  const rp = (uri, options) => {
    return new Promise((resolve, reject) => {
      request(uri, { ...options, json: true }, (error, response) => {
        if (error) reject(error);
        else resolve(response.body);
      });
    });
  };

  const get = (url: string, opts: mixed) => rp(url, { ...opts, method: "GET" });

  const post = (url: string, body: JsonValue, opts: mixed) =>
    rp(url, { ...opts, method: "POST", body });

  const put = (url: string, body: JsonValue, opts: mixed) =>
    rp(url, { ...opts, method: "PUT", body });

  const del = (url: string, opts: mixed) =>
    rp(url, { ...opts, method: "DELETE" });

  return { post, get, put, del };
}
