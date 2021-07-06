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
			duplicateAlias: (alias: string) => {
				const walletSameAlias = profile.wallets().findByAlias(alias.trim());

				if (!walletSameAlias || walletSameAlias.address() === walletAddress) {
					return true;
				}

				if (unsavedAliases?.every(unsavedAlias => !lowerCaseEquals(alias, unsavedAlias))) {
					return true;
				}

				return t("WALLETS.VALIDATION.ALIAS_ASSIGNED", {
					alias: alias.trim(),
				});
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
