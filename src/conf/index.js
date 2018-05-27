// @flow

import yaml from "js-yaml";
import createConfigLoader from "./configLoader";
import { template } from "../utils";

export type NataliConfig = {
  pullRequestId: string,
  provider: {
    name: string,
    config: { [string]: mixed }
  },
  rules: {
    [string]: { config: JsonValue, template?: string }
  }
};

export const conf = createConfigLoader({ yaml, template });
