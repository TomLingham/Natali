// @flow

import path from "path";
import globby from "globby";
import { file as File } from "../../utils/io";
import * as assert from "../assert";
import type { IPrRule } from "..";

export const templatePath = path.resolve(__dirname, "violation.md");

export const handler: IPrRule = async (config = []) => {
  const violations = [];

  for (let rule of config) {
    const ruleViolations = { rule, files: [] };
    const regexp = new RegExp(rule.match, "g");
    const files = await globby([rule.glob, "!**/node_modules"], {
      gitignore: true
    });

    for (let filePath of files) {
      try {
        const fileContent = await File.readFile(path.resolve(filePath));

        if (regexp.test(fileContent)) {
          ruleViolations.files.push(filePath);
        }
      } catch (error) {
        console.error(error);
        process.exit();
      }
    }

    if (ruleViolations.files.length > 0) {
      violations.push(ruleViolations);
    }
  }
  return violations.length > 0 ? assert.fail({ violations }) : assert.ok();
};
