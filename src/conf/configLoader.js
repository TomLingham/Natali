// @flow

import path from "path";
import type { NataliConfig } from ".";
import type { ITemplateRenderer } from "../utils";

type Dependencies = {|
  template: ITemplateRenderer,
  yaml: { safeLoad: string => Object }
|};

const ENV_VARS: { [string]: any } = process.env;

let CONF_PATH;

export default function createConfigLoader({ yaml, template }: Dependencies) {
  function setCwd(configPath) {
    CONF_PATH = configPath;
  }

  function cwd(): string {
    return path.dirname(CONF_PATH);
  }

  async function load(filePath: string): Promise<NataliConfig> {
    let configFile;
    try {
      configFile = await template.render(filePath, ENV_VARS);
      setCwd(filePath);
    } catch (error) {
      throw new Error("There was no configuration file found");
    }

    try {
      // TODO validate the configuration somehow, but for now I'll assume that a
      // successful load means that it's formatted correctly.
      return (yaml.safeLoad(configFile): NataliConfig);
    } catch (error) {
      console.error("There was an error loading the configuration:", filePath);
      throw error;
    }
  }

  return {
    load,
    cwd
  };
}
