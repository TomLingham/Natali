// @flow

import { createBitBucketCloudProvider } from "./provider";
import { api } from "../../utils/http";

export const BitBucketCloud = createBitBucketCloudProvider({ api });
