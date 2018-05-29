// @flow

import path from "path";
import * as rules from "../rules";
import { template } from "../utils";
import { conf } from "../conf";
import { natali } from "../logging";
import type { IPrFail } from "../rules";
import type { IProviderFactory } from "../providers/types";
import type { IRulesModule } from ".";
import type { NataliConfig } from "../conf";
import type { IGit } from "../git";

type Dependencies = {|
  providers: { [string]: IProviderFactory },
  git: IGit
|};

const NATALI_TAG = "[--NATALI:BOT--]";

function isNataliComment<T>(comment: T): boolean {
  if (comment && comment.content && typeof comment.content === "string") {
    return comment.content && comment.content.endsWith(NATALI_TAG);
  }

  return false;
}

export default function createRulesModule({
  providers,
  git
}: Dependencies): IRulesModule {
  async function precheck(config: NataliConfig): Promise<boolean> {
    const currentBranchName = await git.getBranchName();
    if (config.repository && config.repository.ignore) {
      const ignorePattern = config.repository.ignore;
      const ignoreBranchRegex = new RegExp(ignorePattern);
      if (ignoreBranchRegex.test(currentBranchName)) {
        natali.happy(
          `Running on a branch matching the ignore pattern: '${currentBranchName}' matches /${ignorePattern}/.`
        );
        return true;
      }
    }
    return false;
  }

  async function run(nataliConfig: NataliConfig): Promise<mixed> {
    if (await precheck(nataliConfig)) return;

    const runningRules: Promise<{
      name: string,
      result: rules.IPrResult,
      templatePath: string
    }>[] = [];

    for (let ruleName in nataliConfig.rules) {
      const { handler, templatePath } = rules[ruleName];
      const ruleConfig = nataliConfig.rules[ruleName];
      const ruleTemplate = ruleConfig.template;
      const resolvedTemplate =
        ruleTemplate != null
          ? path.resolve(conf.cwd(), ruleTemplate)
          : templatePath;

      runningRules.push(
        handler(ruleConfig.config).then(result => ({
          name: ruleName,
          result,
          templatePath: resolvedTemplate
        }))
      );
    }

    const results = await Promise.all(runningRules);

    const failures: {
      name: string,
      result: IPrFail,
      templatePath: string
    }[] = (results.filter(({ result }) => !result.pass): any);

    const comments = await Promise.all(
      failures.map(({ result, templatePath }) =>
        template.render(templatePath, result.data)
      )
    );

    failures.forEach(({ name }) => {
      natali.ashamed(`I sorry. The ${name} rule was broke.`);
    });

    const provider = providers[nataliConfig.provider.name].create(
      nataliConfig.provider.config
    );

    const comment = comments.concat(NATALI_TAG).join("\n\n----\n\n");

    if (!nataliConfig.pullRequestId) {
      comments.map((co, i) => console.log(`\n\n${i + 1}) ${co}----------\n`));
      return;
    }

    // TODO no any's please!
    const previousComment: any = await provider
      .getPrComments(nataliConfig.pullRequestId)
      .then(coms => coms.find(isNataliComment));

    if (previousComment && failures.length === 0) {
      natali.happy(
        "You fixed everything! Good job! I'll remove my previous comment now."
      );
      await provider.deletePrComment(
        nataliConfig.pullRequestId,
        previousComment.comment_id
      );
    } else if (previousComment) {
      natali.anguish(
        "Oh no! There are still some problems. Updating my previous comment with the latest."
      );
      await provider.updatePrComment(
        nataliConfig.pullRequestId,
        previousComment.comment_id,
        comment
      );
    } else if (!previousComment && failures.length > 0) {
      natali.sad(
        "I'm sorry. There are a few issues with the pull request. Can you please fix?"
      );
      await provider.submitPrComment(nataliConfig.pullRequestId, comment);
    }
  }

  return {
    run
  };
}
