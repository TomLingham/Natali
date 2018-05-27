// @flow

import typeof { readFile } from "fs";
import { logger } from "../../logging";

type Dependencies = {|
  fs: { readFile: readFile }
|};

export function createFileModule({ fs }: Dependencies) {
  logger.silly("Creating file module.");

  function readFile(path: string): Promise<string> {
    logger.silly("Reading file:", path);
    return new Promise((resolve, reject) => {
      fs.readFile(path, (error, buffer) => {
        if (error) {
          logger.silly(error);
          reject(error);
        } else {
          logger.silly("File read success:", path);
          resolve(buffer.toString());
        }
      });
    });
  }

  return {
    readFile
  };
}
