// @flow

import { file } from "./io";
import { spawn } from "child_process";

import { createTemplateModule } from "./template";
import { createProcModule } from "./proc";

export const proc = createProcModule({ spawn });
export const template = createTemplateModule({ file });

export type IProcess = typeof proc;
export type ITemplateRenderer = typeof template;
