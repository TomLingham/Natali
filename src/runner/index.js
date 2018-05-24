// @flow

import createRulesModule from "./runner";
import { type NataliConfig } from "../conf";
import { git } from "../git";

export interface IRulesModule {
  run: NataliConfig => Promise<any>;
}

export const runner = createRulesModule({ git });
