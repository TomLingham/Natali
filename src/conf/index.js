// @flow

import yaml from "js-yaml";
import createConfigLoader from "./configLoader";
import { file } from "../utils/io";

type JsonValue =
  | number
  | string
  | boolean
  | null
  | JsonValue[]
  | ({ [string]: JsonValue } & { $call?: void });

export type NataliConfig = {
  rules: {
    [string]: { config: JsonValue, template?: string }
  }
};

export interface IConfigLoader {
  load: string => Promise<NataliConfig>;
  cwd: () => string;
}

export const conf = createConfigLoader({ file, yaml });
