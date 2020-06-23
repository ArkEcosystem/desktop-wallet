// Translations
import { translations as CONTACTS } from "../../../domains/contacts/i18n";
import { translations as EXCHANGE } from "../../../domains/exchange/i18n";
import { translations as HELP } from "../../../domains/help/i18n";
import { translations as PLUGINS } from "../../../domains/plugins/i18n";
import { translations as PROFILE } from "../../../domains/profile/i18n";
import { translations as SEARCH } from "../../../domains/search/i18n";
import { translations as SETTINGS } from "../../../domains/settings/i18n";
import { translations as TRANSACTION } from "../../../domains/transaction/i18n";
import { translations as WALLETS } from "../../../domains/wallets/i18n";
import { translations as COMMON } from "../common/i18n";

export const buildTranslations = (): any => ({
	COMMON,
	CONTACTS,
	EXCHANGE,
	HELP,
	PLUGINS,
	PROFILE,
	SEARCH,
	SETTINGS,
	TRANSACTION,
	WALLETS,
});
