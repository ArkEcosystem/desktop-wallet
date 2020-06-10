import { locales } from "./locales";
import { flattenMessages } from "./utils";

export const translations = {
	"en-US": flattenMessages(locales["en-US"].messages),
};
