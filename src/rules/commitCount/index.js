// @flow

import path from "path";
import { git } from "../../git";
import * as assert from "../assert";
import type { IPrRule } from "..";

type Config = {
  max: number,
  branch: string
};

export const templatePath = path.resolve(__dirname, "violation.md");

export const handler: IPrRule = async (
  config: Config = { max: 1, branch: "master" }
) => {
  const numberOfCommits = await git.getCommitCountAheadOfBranch(config.branch);

  if (numberOfCommits > config.max) {
    const commits = await git.getCommitLog(numberOfCommits);

    return assert.fail({
      numberOfCommits,
      commits: commits.map((commit, index) => ({ commit, index: index + 1 })),
      maxCommits: config.max
    });
  }

  return assert.ok();
};
