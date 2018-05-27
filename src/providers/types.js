// @flow

export interface IProvider {
  getPrComments(pullRequestId: string): Promise<JsonValue[]>;
  deletePrComment(pullRequestId: string, commentId: string): Promise<JsonValue>;
  submitPrComment(pullRequestId: string, comment: string): Promise<JsonValue>;
  updatePrComment(
    pullRequestId: string,
    commentId: string,
    comment: string
  ): Promise<JsonValue>;
}

export type IProviderFactory = {
  create(any): IProvider
};
