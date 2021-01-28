import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Icon } from "app/components/Icon";
import { Tooltip } from "app/components/Tooltip";
import React from "react";
import { useTranslation } from "react-i18next";

const getIconName = (type: string) => {
	switch (type) {
		case "Starred":
			return "Star";
		case "MultiSignature":
			return "Multisig";
		default:
			return type;
	}
};

const getIconColor = (type: string) => (type === "Starred" ? "text-theme-warning-400" : "text-theme-text");

const WalletIcon = ({ type, value }: { type: string; value?: string }) => {
	const { t } = useTranslation();

	return (
		<Tooltip content={t(`COMMON.${type.toUpperCase()}`, { value })}>
			<div data-testid={`WalletIcon__${getIconName(type)}`} className={`inline-block p-1 ${getIconColor(type)}`}>
				<Icon name={getIconName(type)} height={16} />
			</div>
		</Tooltip>
	);
};

export const WalletIcons = ({ wallet }: { wallet: ReadWriteWallet }) => (
	<>
		{wallet.isKnown() && <WalletIcon type="Verified" value={wallet.knownName()} />}
		{wallet.isLedger() && <WalletIcon type="Ledger" />}
		{wallet.isStarred() && <WalletIcon type="Starred" />}
		{wallet.hasSyncedWithNetwork() && wallet.isMultiSignature() && <WalletIcon type="MultiSignature" />}
	</>
);
