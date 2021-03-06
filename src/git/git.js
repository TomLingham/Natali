// @flow

import type { IProcess } from "../utils";

type Dependencies = {|
  proc: IProcess
|};

export default function createGitModule({ proc }: Dependencies) {
  async function getBranchName(): Promise<string> {
    const { stdout: branchName } = await proc.spawnp("git", [
      "rev-parse",
      "--abbrev-ref",
      "HEAD"
    ]);
    return branchName;
  }

  async function getCommitCountAheadOfBranch(
    branch?: string = "main"
  ): Promise<number> {
    const branchName = await getBranchName();
    const { stdout } = await proc.spawnp("git", [
      "log",
      "--oneline",
      branchName,
      `^${branch}`
    ]);
    return stdout.split("\n").length;
  }

  async function getAuthorName(): Promise<string> {
    const { stdout: authorName } = await proc.spawnp("git", [
      "show",
      "-s",
      "--pretty=format:%an"
    ]);
    return authorName;
  }

  async function getCommitLog(
    numberOfCommits?: number = 1,
    format?: string = "%h - %s"
  ): Promise<string[]> {
    const { stdout: commits } = await proc.spawnp("git", [
      "log",
      "-n",
      `${numberOfCommits}`,
      "-s",
      `--pretty=${format}`
    ]);

    return commits.split("\n");
  }

  return {
    getAuthorName,
    getBranchName,
    getCommitCountAheadOfBranch,
    getCommitLog
  };
}
