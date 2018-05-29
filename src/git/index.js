// @flow

import createGitCommand from "./git";
import { proc } from "../utils";

export const git = createGitCommand({ proc });

export type IGit = typeof git;
