import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { TFunction } from "i18next";
import { lowerCaseEquals } from "utils/equals";

export const alias = ({
	t,
	walletAddress,
	profile,
	unsavedAliases,
}: {
	t: TFunction;
	walletAddress: string;
	profile: Contracts.IProfile;
	unsavedAliases?: string[];
}) => {
	const maxLength = 42;

	return {
		maxLength: {
			message: t("WALLETS.VALIDATION.ALIAS_MAXLENGTH", {
				maxLength,
			}),
			value: maxLength,
		},
		required: t("WALLETS.VALIDATION.ALIAS_REQUIRED"),
		validate: {
			duplicateAlias: (value: string) => {
				const alias = value.trim();

				const error = t("WALLETS.VALIDATION.ALIAS_ASSIGNED", { alias });

				if (unsavedAliases?.some(unsavedAlias => lowerCaseEquals(unsavedAlias, alias))) {
					return error;
				}

				const walletSameAlias = profile.wallets().findByAlias(alias);

				if (!walletSameAlias || walletSameAlias.address() === walletAddress) {
					return true;
				}

				return error;
			},
			empty: (alias: string) => {
				if (alias.trim() === "") {
					return t("WALLETS.VALIDATION.ALIAS_REQUIRED");
				}

				return true;
			},
		},
	};
};
