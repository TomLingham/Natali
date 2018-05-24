// @flow

const mustache = require("mustache");
import { type ITemplateModule } from ".";
import { type FileModule } from "./io";

type Dependencies = {
  file: FileModule
};

export function createTemplateModule({ file }: Dependencies): ITemplateModule {
  async function render(filePath, vars) {
    const templateFile = await file.readFile(filePath);
    return mustache.render(templateFile, vars);
  }

  return {
    render
  };
}
