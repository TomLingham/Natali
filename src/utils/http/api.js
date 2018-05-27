// @flow

import typeof request from "request";

type Dependencies = {|
  request: request
|};

type RequestOptions = { [string]: mixed };

export function createHttpClient({ request }: Dependencies) {
  const rp = (uri, options) => {
    return new Promise((resolve, reject) => {
      request(uri, { ...options, json: true }, (error, response) => {
        if (error) reject(error);
        else resolve(response.body);
      });
    });
  };

  function get<T: JsonValue>(url: string, opts: RequestOptions): Promise<T> {
    return rp(url, { ...opts, method: "GET" });
  }

  function del<T: JsonValue>(url: string, opts: RequestOptions): Promise<T> {
    return rp(url, { ...opts, method: "DELETE" });
  }

  function post<T: JsonValue>(
    url: string,
    body: JsonValue,
    opts: RequestOptions
  ): Promise<T> {
    return rp(url, { ...opts, method: "POST", body });
  }

  function put<T: JsonValue>(
    url: string,
    body: JsonValue,
    opts: RequestOptions
  ): Promise<T> {
    return rp(url, { ...opts, method: "PUT", body });
  }

  return { post, get, put, del };
}
