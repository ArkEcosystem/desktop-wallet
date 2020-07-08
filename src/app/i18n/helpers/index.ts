// Translations
import { translations as CONTACTS } from "../../../domains/contact/i18n";
import { translations as DASHBOARD } from "../../../domains/dashboard/i18n";
import { translations as EXCHANGE } from "../../../domains/exchange/i18n";
import { translations as HELP } from "../../../domains/help/i18n";
import { translations as OFFLINE } from "../../../domains/offline/i18n";
import { translations as PLUGINS } from "../../../domains/plugin/i18n";
import { translations as PROFILE } from "../../../domains/profile/i18n";
import { translations as SETTINGS } from "../../../domains/setting/i18n";
import { translations as TRANSACTION } from "../../../domains/transaction/i18n";
import { translations as VOTE } from "../../../domains/vote/i18n";
import { translations as WALLETS } from "../../../domains/wallet/i18n";
import { translations as COMMON } from "../common/i18n";

export const buildTranslations = (): any => ({
	COMMON,
	CONTACTS,
	DASHBOARD,
	EXCHANGE,
	HELP,
	OFFLINE,
	PLUGINS,
	PROFILE,
	VOTE,
	SETTINGS,
	TRANSACTION,
	WALLETS,
});
