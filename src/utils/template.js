// @flow

import mustache from "mustache";
import { logger } from "../logging";
import type { IFile } from "./io";

type Dependencies = {|
  file: IFile
|};

export function createTemplateModule({ file }: Dependencies) {
  logger.silly("Creating process module.");

  async function render(filePath: string, vars: { [string]: mixed }) {
    logger.debug("Rendering template", filePath);
    const templateFile = await file.readFile(filePath);
    return mustache.render(templateFile, vars);
  }

  return {
    render
  };
}
