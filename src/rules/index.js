// @flow

export type IPrFail = { pass: false, data: { [string]: mixed } };
export type IPrSuccess = { pass: true };
export type IPrResult = IPrFail | IPrSuccess;

export type IPrRule = (config: Object) => Promise<IPrResult>;

export * as commitCount from "./commitCount";
export * as indentation from "./indentation";
export * as stringMatch from "./stringMatch";
