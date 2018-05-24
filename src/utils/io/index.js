// @flow

import fs from "fs";
import { createFileModule } from "./file";

export interface FileModule {
  readFile: string => Promise<string>;
}

export const file = createFileModule({ fs });
