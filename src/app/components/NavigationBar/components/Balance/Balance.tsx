import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { Amount } from "app/components/Amount";
import { useProfileBalance } from "app/hooks/use-profile-balance";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { BalanceSkeleton } from "./BalanceSkeleton";

interface BalanceProps {
	profile?: Contracts.IProfile;
	isLoading?: boolean;
}

export const Balance = ({ profile, isLoading }: BalanceProps) => {
	const [width, setWidth] = useState<number | undefined>();

	const { t } = useTranslation();
	const { convertedBalance } = useProfileBalance({ profile, isLoading });

	const callbackRef = useCallback(
		(node) => {
			if (node) {
				setWidth(node.clientWidth);
			}
		},
		[convertedBalance],
	);

	if (isLoading) {
		return <BalanceSkeleton width={width} />;
	}

	return (
		<div className="text-right">
			<div className="text-xs font-semibold text-theme-secondary-700">{t("COMMON.YOUR_BALANCE")}</div>
			<div
				ref={callbackRef}
				className="text-sm font-bold text-theme-secondary-text dark:text-theme-text"
				data-testid="Balance__value"
			>
				<Amount
					value={convertedBalance}
					ticker={profile?.settings().get<string>(Contracts.ProfileSetting.ExchangeCurrency) || ""}
					normalize={false}
				/>
			</div>
		</div>
	);
};
