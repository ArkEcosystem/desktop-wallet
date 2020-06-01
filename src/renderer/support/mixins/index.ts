import { merge } from "lodash";

const allMixins = [require("./assets").default];

export const mixins = merge(...(allMixins as [any, any]));
