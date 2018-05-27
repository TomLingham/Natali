// @flow

import createGitCommand from "./git";
import { proc } from "../utils";

export interface IGitModule {
  getAuthorName: () => Promise<string>;
  getBranchName: () => Promise<string>;
  getCommitCountAheadOfBranch: (branch?: string) => Promise<number>;
  getCommitLog: (
    numberOfCommits?: number,
    format?: string
  ) => Promise<string[]>;
}

export const git = createGitCommand({ proc });
