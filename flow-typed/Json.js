// @flow

declare type JsonValue =
  | number
  | string
  | boolean
  | null
  | JsonValue[]
  | ({ [string]: JsonValue } & { $call?: void });
