// @flow

import { spawn } from "child_process";
import { file } from "./io";

import { createTemplateModule } from "./template";
import { createProcModule } from "./proc";

export type ProcessResult = {
  code: number,
  stdout: string,
  stderr: string
};

export interface IProcModule {
  spawnp: (string, string[], options?: Object) => Promise<ProcessResult>;
}

export interface ITemplateModule {
  render: (path: string, { [string]: any }) => Promise<string>;
}

export const proc = createProcModule({ spawn });
export const template = createTemplateModule({ file });
