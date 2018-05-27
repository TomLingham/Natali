// @flow

import path from "path";
import yargs from "yargs";

import { conf } from "./conf";
import { runner } from "./runner";

import { logger, natali } from "./logging";

yargs
  .option("pullrequest", {
    alias: "p",
    describe: "The pull request or change ID associated with the pull request.",
    demandOption: true,
    requiresArg: true
  })
  .command({
    command: "run [configPath]",
    aliases: ["* [configPath]"],
    desc: "Run the violation check with the provided config.",
    handler: async ({ configPath = "natali.yaml", pullrequest }) => {
      if (!pullrequest) {
        process.exit(1);
      }

      natali.nervous("Kindly inspecting your code. Please wait...");

      await conf
        .load(path.resolve(process.cwd(), configPath))
        .then(config => ({ ...config, pullRequestId: pullrequest }))
        .then(runner.run)
        .catch(error => {
          natali.anguish("Oh no!", error);
          logger.error(error.stack);
        });
    }
  });

/**
 * Generate help and output argv
 */
yargs
  .default("run")
  .help("help")
  .alias("help", "h");

/**
 * On fail, print generic error and dump the error as well
 */
yargs.fail((message, error) => natali.sad(message, error));

/**
 * Print out the arguments
 */
if (yargs.argv.output) console.log(yargs.argv.output);
