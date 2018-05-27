// @flow

import yaml from "js-yaml";
import createConfigLoader from "./configLoader";
import { file } from "../utils/io";
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

export interface IConfigLoader {
  load: string => Promise<NataliConfig>;
  cwd: () => string;
}

export const conf = createConfigLoader({ yaml, template });
