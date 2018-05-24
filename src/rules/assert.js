// @flow

import type { IPrSuccess, IPrFail } from ".";

export function ok(): IPrSuccess {
  return { pass: true };
}

export function fail(data: { [string]: mixed }): IPrFail {
  return { pass: false, data };
}
