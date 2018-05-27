// @flow

import chalk from "chalk";
import { type ChildProcess } from "child_process";
import { type ProcessResult, IProcModule } from ".";

type Dependencies = {
  spawn: (string, string[], Object) => ChildProcess
};

export function createProcModule({ spawn }: Dependencies): IProcModule {
  function spawnp(
    command: string,
    args: string[],
    options?: Object = {}
  ): Promise<ProcessResult> {
    return new Promise((resolve, reject) => {
      const proc = spawn(command, args, options);
      let stdout = "";
      let stderr = "";

      proc.stdout.on("data", data => {
        const str = data.toString();
        stdout += str;
        process.stdout.write(`${chalk.green("[", command, "]")}  ${str}`);
      });

      proc.stderr.on("data", data => {
        const str = data.toString();
        stderr += str;
        process.stdout.write(`${chalk.red("[", command, "]")}  ${str}`);
      });

      proc.on("close", code => {
        const result = { stdout: stdout.trim(), stderr: stderr.trim(), code };
        if (code === 0) resolve(result);
        else reject(result);
      });
    });
  }

  return {
    spawnp
  };
}
