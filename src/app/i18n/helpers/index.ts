// Translations
import common from "../common";
import help from "../../../domains/help/i18n";
import wallets from "../../../domains/wallets/i18n";

export const buildTranslations = (locale) => ({
	COMMON: common[locale],
	HELP: help[locale],
	WALLETS: wallets[locale],
});
