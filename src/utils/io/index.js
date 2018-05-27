// @flow

import fs from "fs";
import { createFileModule } from "./file";

export const file = createFileModule({ fs });

export type IFile = typeof file;
