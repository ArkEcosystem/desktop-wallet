// Translations
import { translations as CONTACTS } from "../../../domains/contacts/i18n";
import { translations as EXCHANGE } from "../../../domains/exchange/i18n";
import { translations as HELP } from "../../../domains/help/i18n";
import { translations as OFFLINE } from "../../../domains/offline/i18n";
import { translations as PLUGINS } from "../../../domains/plugins/i18n";
import { translations as PROFILE } from "../../../domains/profile/i18n";
import { translations as SEARCH } from "../../../domains/search/i18n";
import { translations as SETTINGS } from "../../../domains/setting/i18n";
import { translations as SUPPORT } from "../../../domains/support/i18n";
import { translations as TRANSACTION } from "../../../domains/transaction/i18n";
import { translations as WALLETS } from "../../../domains/wallets/i18n";
import { translations as COMMON } from "../common/i18n";

export const buildTranslations = (): any => ({
	COMMON,
	CONTACTS,
	EXCHANGE,
	HELP,
	OFFLINE,
	PLUGINS,
	PROFILE,
	SEARCH,
	SETTINGS,
	SUPPORT,
	TRANSACTION,
	WALLETS,
});
