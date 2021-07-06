import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { TFunction } from "i18next";

export const alias = ({
	t,
	wallet,
	profile,
}: {
	t: TFunction;
	wallet: Contracts.IReadWriteWallet;
	profile: Contracts.IProfile;
}) => {
	const maxLength = 42;

	return {
		maxLength: {
			message: t("WALLETS.PAGE_IMPORT_WALLET.VALIDATION.MAXLENGTH_ERROR", {
				maxLength,
			}),
			value: maxLength,
		},
		required: t("WALLETS.PAGE_IMPORT_WALLET.VALIDATION.ALIAS_REQUIRED"),
		validate: {
			duplicateAlias: (alias: string) => {
				const walletSameAlias = profile.wallets().findByAlias(alias.trim());

				if (!walletSameAlias || walletSameAlias.id() === wallet.id()) {
					return true;
				}

				return t("WALLETS.PAGE_IMPORT_WALLET.VALIDATION.ALIAS_EXISTS", {
					alias: alias.trim(),
				});
			},
		},
	};
};
