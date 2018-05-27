// @flow

import createRulesModule from "./runner";
import { type NataliConfig } from "../conf";
import * as providers from "../providers";

export interface IRulesModule {
  run: NataliConfig => Promise<any>;
}

export const runner = createRulesModule({ providers });
