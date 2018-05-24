// @flow

import fs from "fs";
import { type FileModule } from ".";

type Dependencies = {
  fs: { readFile: typeof fs.readFile }
};

export function createFileModule({ fs }: Dependencies): FileModule {
  function readFile(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (error, buffer) => {
        if (error) reject(error);
        else resolve(buffer.toString());
      });
    });
  }

  return {
    readFile
  };
}
