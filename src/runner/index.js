// @flow

import createRulesModule from "./runner";
import * as providers from "../providers";
import type { NataliConfig } from "../conf";

export interface IRulesModule {
  run: NataliConfig => Promise<any>;
}

export const runner = createRulesModule({ providers });
