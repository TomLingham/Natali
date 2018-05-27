// @flow

import fs from "fs";

type Dependencies = {
  fs: { readFile: typeof fs.readFile }
};

export function createFileModule({ fs }: Dependencies) {
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
