// @flow

const mustache = require("mustache");
import type { IFile } from "./io";

type Dependencies = {
  file: IFile
};

export function createTemplateModule({ file }: Dependencies) {
  async function render(filePath: string, vars: { [string]: mixed }) {
    const templateFile = await file.readFile(filePath);
    return mustache.render(templateFile, vars);
  }

  return {
    render
  };
}
