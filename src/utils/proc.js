// @flow

import type { ChildProcess } from "child_process";
import { logger } from "../logging";

type Dependencies = {|
  spawn: (string, string[], Object) => ChildProcess
|};

export type ProcessResult = {
  code: number,
  stdout: string,
  stderr: string
};

export function createProcModule({ spawn }: Dependencies) {
  logger.silly("Creating process module.");

  function spawnp(
    command: string,
    args: string[],
    options?: Object = {}
  ): Promise<ProcessResult> {
    logger.debug(
      "Spawning process",
      command,
      args.join(" "),
      JSON.stringify(options)
    );

    return new Promise((resolve, reject) => {
      const proc = spawn(command, args, options);
      let stdout = "";
      let stderr = "";

      proc.stdout.on("data", data => {
        const str = data.toString();
        logger.silly("Proc: stdout", str);
        stdout += str;
      });

      proc.stderr.on("data", data => {
        const str = data.toString();
        logger.silly("Proc: stderr", str);
        stderr += str;
      });

      proc.on("close", code => {
        logger.silly(
          "Process closed",
          command,
          args.join(" "),
          JSON.stringify(options)
        );
        const result = { stdout: stdout.trim(), stderr: stderr.trim(), code };
        logger.debug(JSON.stringify(result));

        if (code === 0) resolve(result);
        else reject(result);
      });
    });
  }

  return {
    spawnp
  };
}
