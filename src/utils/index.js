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

export const proc = createProcModule({ spawn });
export const template = createTemplateModule({ file });

export type IProcess = typeof proc;
export type ITemplateRenderer = typeof template;
