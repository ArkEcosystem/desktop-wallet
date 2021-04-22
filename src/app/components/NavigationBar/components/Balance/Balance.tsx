import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { Amount } from "app/components/Amount";
import React from "react";
import { useTranslation } from "react-i18next";

import { BalanceSkeleton } from "./BalanceSkeleton";
import { useProfileBalance } from "app/hooks/use-profile-balance";

type BalanceProps = {
	profile?: Contracts.IProfile;
	isLoading?: boolean;
};

export const Balance = ({ profile, isLoading }: BalanceProps) => {
	const { t } = useTranslation();
	const { convertedBalance } = useProfileBalance({ profile, isLoading });

	if (isLoading) {
		return <BalanceSkeleton />;
	}

	return (
		<div className="text-right">
			<div className="text-xs font-semibold text-theme-secondary-700">{t("COMMON.YOUR_BALANCE")}</div>
			<div className="text-sm font-bold text-theme-secondary-text dark:text-theme-text">
				<Amount
					value={convertedBalance}
					ticker={profile?.settings().get<string>(Contracts.ProfileSetting.ExchangeCurrency) || ""}
					normalize={false}
				/>
			</div>
		</div>
	);
};
