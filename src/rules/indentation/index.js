// @flow

import detectIndent from "detect-indent";
import path from "path";
import globby from "globby";
import { git } from "../../git";
import { proc } from "../../utils";
import { file as File } from "../../utils/io";
import * as assert from "../assert";
import type { IPrRule } from "..";
import { conf } from "../../conf";

export const templatePath = path.resolve(__dirname, "violation.md");

export const handler: IPrRule = async (config = [], templatePath) => {
  const violations = [];

  for (let indentRule of config) {
    const files = await globby([indentRule.glob, "!**/node_modules"], {
      gitignore: true
    });

    for (let file of files) {
      try {
        const { indent, type, amount } = detectIndent(
          await File.readFile(path.resolve(file))
        );

        // We can't reliably detect code that has block comments in it as it raises a
        // false negative, so we just ignore it.
        if (amount === 1 && type === 'space') continue;

        // If the indentation cannot be detected, exit early.
        if (!type) continue;

        if (amount !== indentRule.size || type !== indentRule.type) {
          violations.push({ file, size: amount, type });
        }
      } catch (error) {
        console.error(error);
        process.exit();
      }
    }
  }
  return violations.length > 0 ? assert.fail({ violations }) : assert.ok();
};
