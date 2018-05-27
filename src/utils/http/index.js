// @flow

import request from "request";
import { createHttpClient } from "./api";

export const api = createHttpClient({ request });

export type IHttpClient = typeof api;
