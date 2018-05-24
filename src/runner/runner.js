// @flow

import path from "path";
import { type NataliConfig } from "../conf";
import { type IGitModule } from "../git";
import { type IRulesModule } from ".";
import * as rules from "../rules";
import { template } from "../utils";
import { type IPrFail } from "../rules";
import { conf } from "../conf";

type Dependencies = {
  git: IGitModule
};

export default function createRulesModule({ git }: Dependencies): IRulesModule {
  async function run(nataliConfig: NataliConfig) {
    const runningRules: Promise<{
      result: rules.IPrResult,
      templatePath: string
    }>[] = [];

    for (let ruleName in nataliConfig.rules) {
      const { handler, templatePath } = rules[ruleName];
      const ruleConfig = nataliConfig.rules[ruleName];
      const ruleTemplate = ruleConfig.template;
      runningRules.push(
        handler(ruleConfig.config).then(result => ({
          result,
          templatePath:
            ruleTemplate != null
              ? path.resolve(conf.cwd(), ruleTemplate)
              : templatePath
        }))
      );
    }

    const results = await Promise.all(runningRules);
    const failures: {
      result: IPrFail,
      templatePath: string
    }[] = (results.filter(({ result }) => !result.pass): any);

    const comments = await Promise.all(
      failures.map(({ result, templatePath }) =>
        template.render(templatePath, result.data)
      )
    );
    comments.forEach(x => console.log("\n\n\n", x));
  }

  return {
    run
  };
}
