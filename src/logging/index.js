// @flow

import LogDriver from "log-driver";
import chalk from "chalk";

const kamoji = {
  anguish: "(#><)",
  ashamed: "(⌒_⌒;)",
  happy: "(o^▽^o)",
  nervous: "(ノωヽ)",
  sad: "(╥_╥)"
};

function formatLogging(level, ...messages) {
  let output = "";
  switch (level) {
    case "fail":
      output += chalk.black.bgRed("fail");
      break;
    case "error":
      output += chalk.red("erro");
      break;
    case "warn":
      output += chalk.yellow("warn");
      break;
    case "info":
      output += chalk.blue("info");
      break;
    case "debug":
      output += chalk.bgGreen.black("debg");
      break;
    case "silly":
      output += chalk.bgCyan.black("sill");
      break;
  }
  return `${output}  ${messages.join("  ")}`;
}

function formatNatali(level, ...messages) {
  let output = "";
  switch (level) {
    case "nervous":
      output += chalk.bold.white(kamoji.nervous);
      break;
    case "happy":
      output += chalk.bold.green(kamoji.happy);
      break;
    case "sad":
      output += chalk.bold.cyan(kamoji.sad);
      break;
    case "ashamed":
      output += chalk.bold.yellow(kamoji.ashamed);
      break;
    case "anguish":
      output += chalk.bold.red(kamoji.anguish);
      break;
  }
  return `${output}  ${messages.join("  ")}`;
}

export const logger = LogDriver({
  levels: ["fail", "error", "warn", "info", "debug", "silly"],
  level: process.env.LOG_LEVEL || "debug",
  format: formatLogging
});

export const natali = LogDriver({
  levels: ["happy", "nervous", "sad", "ashamed", "anguish"],
  format: formatNatali
});
