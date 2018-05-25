// @flow

export interface IProvider {
  getPrComments(pullRequestId: string): Promise<any[]>;
  deletePrComment(pullRequestId: string, commentId: string): Promise<any>;
  submitPrComment(pullRequestId: string, comment: string): Promise<any>;
  updatePrComment(
    pullRequestId: string,
    commentId: string,
    comment: string
  ): Promise<any>;
}

export type IProviderFactory = {
  create(any): IProvider
};
