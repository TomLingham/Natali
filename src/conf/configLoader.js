// @flow

import path from "path";
import type { NataliConfig, IConfigLoader } from ".";
import type { FileModule } from "../utils/io";

type Dependencies = {
  file: FileModule,
  yaml: { safeLoad: string => Object }
};

let CONF_PATH;

export default function createConfigLoader({
  file,
  yaml
}: Dependencies): IConfigLoader {
  function setCwd(configPath) {
    CONF_PATH = configPath;
  }

  function cwd() {
    return path.dirname(CONF_PATH);
  }

  async function load(filePath: string): Promise<NataliConfig> {
    let configFile;
    try {
      configFile = await file.readFile(filePath);
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
