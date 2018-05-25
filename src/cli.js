// @flow

import chalk from "chalk";
import path from "path";
import yargs from "yargs";

import { conf } from "./conf";
import { runner } from "./runner";
import { BitBucketCloud } from "./providers/BitBucketCloud";

const kamoji = {
  anguish: "(#><)",
  embarrased: "(⌒_⌒;)",
  happy: "(o^▽^o)"
};

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

      console.log(
        chalk.bold.cyan(kamoji.happy),
        "Kindly inspecting your code. Please wait..."
      );

      await conf
        .load(path.resolve(process.cwd(), configPath))
        .then(config => ({ ...config, pullRequestId: pullrequest }))
        .then(runner.run)
        .catch(error => {
          console.error(
            chalk.red("Error:"),
            error.message,
            chalk.red(kamoji.embarrased)
          );
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
yargs.fail((message, err) =>
  console.error(chalk.red(kamoji.anguish), message, err)
);

/**
 * Print out the arguments
 */
if (yargs.argv.output) console.log(yargs.argv.output);
