// Translations
import { translations as CONTACTS } from "../../../domains/contact/i18n";
import { translations as DASHBOARD } from "../../../domains/dashboard/i18n";
import { translations as ERROR } from "../../../domains/error/i18n";
import { translations as EXCHANGE } from "../../../domains/exchange/i18n";
import { translations as NEWS } from "../../../domains/news/i18n";
import { translations as PLUGINS } from "../../../domains/plugin/i18n";
import { translations as PROFILE } from "../../../domains/profile/i18n";
import { translations as SETTINGS } from "../../../domains/setting/i18n";
import { translations as SPLASH } from "../../../domains/splash/i18n";
import { translations as TRANSACTION } from "../../../domains/transaction/i18n";
import { translations as VOTE } from "../../../domains/vote/i18n";
import { translations as WALLETS } from "../../../domains/wallet/i18n";
import { translations as COMMON } from "../common/i18n";

export const buildTranslations = (): any => ({
	COMMON,
	CONTACTS,
	DASHBOARD,
	EXCHANGE,
	NEWS,
	ERROR,
	PLUGINS,
	PROFILE,
	VOTE,
	SETTINGS,
	TRANSACTION,
	WALLETS,
	SPLASH,
});
