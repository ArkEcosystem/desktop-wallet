import { Contracts } from "@arkecosystem/platform-sdk-profiles";
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
		case "SecondSignature":
			return "Key";
		default:
			return type;
	}
};

const getIconColor = (type: string) => (type === "Starred" ? "text-theme-warning-400" : "text-theme-text");

const WalletIcon = ({ type, label, iconColor }: { type: string; label?: string; iconColor?: string }) => {
	const { t } = useTranslation();

	return (
		<Tooltip content={label || t(`COMMON.${type.toUpperCase()}`)}>
			<div
				data-testid={`WalletIcon__${getIconName(type)}`}
				className={`inline-block p-1 ${iconColor || getIconColor(type)}`}
			>
				<Icon name={getIconName(type)} height={16} />
			</div>
		</Tooltip>
	);
};

export const WalletIcons = ({
	wallet,
	iconColor,
	exclude,
}: {
	wallet: Contracts.IReadWriteWallet;
	iconColor?: string;
	exclude?: string[];
}) => {
	const { t } = useTranslation();

	return (
		<>
			{!exclude?.includes("isKnown") && wallet.isKnown() && (
				<WalletIcon
					type="Verified"
					label={t(`COMMON.VERIFIED`, { value: wallet.knownName() })}
					iconColor={iconColor}
				/>
			)}
			{!exclude?.includes("isSecondSignature") && wallet.hasSyncedWithNetwork() && wallet.isSecondSignature() && (
				<WalletIcon type="SecondSignature" label={t("COMMON.SECOND_SIGNATURE")} iconColor={iconColor} />
			)}
			{!exclude?.includes("isLedger") && wallet.isLedger() && <WalletIcon type="Ledger" iconColor={iconColor} />}
			{!exclude?.includes("isStarred") && wallet.isStarred() && (
				<WalletIcon type="Starred" iconColor={iconColor} />
			)}
			{!exclude?.includes("isMultiSignature") && wallet.hasSyncedWithNetwork() && wallet.isMultiSignature() && (
				<WalletIcon type="MultiSignature" iconColor={iconColor} />
			)}
		</>
	);
};
