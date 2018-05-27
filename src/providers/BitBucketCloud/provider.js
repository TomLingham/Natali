// @flow

import type { IHttpClientModule } from "../../utils/http";
import type { IProvider, IProviderFactory } from "../types";

const BITBUCKET_API_VERSION = "1.0";
const BITBUCKET_URI = "https://api.bitbucket.org";

const BASE_URL = `${BITBUCKET_URI}/${BITBUCKET_API_VERSION}`;

type Dependencies = {
  api: IHttpClientModule
};

type BitBucketConfig = {
  org: string,
  user: string,
  pass: string,
  repo: string
};

export function createBitBucketCloudProvider({
  api
}: Dependencies): IProviderFactory {
  function create({ org, user, pass, repo }: BitBucketConfig): IProvider {
    const auth = { user, pass };

    const createResource = (resource, path) =>
      `${BASE_URL}/${resource}/${org}/${repo}/${path}/`;

    function submitPrComment(pullRequestId: string, content: string) {
      const url = createResource(
        "repositories",
        `pullrequests/${pullRequestId}/comments`
      );
      return api.post(url, { content }, { auth });
    }

    function getPrComments(pullRequestId: string) {
      const url = createResource(
        "repositories",
        `pullrequests/${pullRequestId}/comments`
      );
      return api.get(url, { auth });
    }

    function updatePrComment(
      pullRequestId: string,
      commentId,
      content: string
    ) {
      const url = createResource(
        "repositories",
        `pullrequests/${pullRequestId}/comments/${commentId}`
      );
      return api.put(url, { content }, { auth });
    }

    function deletePrComment(pullRequestId: string, commentId) {
      const url = createResource(
        "repositories",
        `pullrequests/${pullRequestId}/comments/${commentId}`
      );
      return api.del(url, { auth });
    }

    return {
      getPrComments,
      deletePrComment,
      submitPrComment,
      updatePrComment
    };
  }

  return {
    create
  };
}
