// @flow

import path from "path";
import { type NataliConfig } from "../conf";
import type { IProviderFactory } from "../providers/types";
import { type IRulesModule } from ".";
import * as rules from "../rules";
import { template } from "../utils";
import { type IPrFail } from "../rules";
import { conf } from "../conf";

type Dependencies = {|
  providers: { [string]: IProviderFactory }
|};

const NATALI_TAG = "[--NATALI:BOT--]";

function isNataliComment(comment: any) {
  return comment.content && comment.content.endsWith(NATALI_TAG);
}

export default function createRulesModule({
  providers
}: Dependencies): IRulesModule {
  async function run(nataliConfig: NataliConfig): Promise<mixed> {
    const runningRules: Promise<{
      result: rules.IPrResult,
      templatePath: string
    }>[] = [];

    const provider = providers[nataliConfig.provider.name].create(
      nataliConfig.provider.config
    );

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

    const previousComment = await provider
      .getPrComments(nataliConfig.pullRequestId)
      .then(coms => coms.find(isNataliComment));

    const comment = comments.concat(NATALI_TAG).join("\n\n\n----\n\n");

    if (previousComment && failures.length === 0) {
      provider.deletePrComment(
        nataliConfig.pullRequestId,
        previousComment.comment_id
      );
    } else if (previousComment) {
      provider.updatePrComment(
        nataliConfig.pullRequestId,
        previousComment.comment_id,
        comment
      );
    } else if (!previousComment && failures.length > 0) {
      provider.submitPrComment(nataliConfig.pullRequestId, comment);
    }
  }

  return {
    run
  };
}
