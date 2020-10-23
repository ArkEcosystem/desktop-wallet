import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Modal } from "app/components/Modal";
import {
	TransactionConfirmations,
	TransactionExplorerLink,
	TransactionFee,
	TransactionSender,
	TransactionTimestamp,
} from "domains/transaction/components/TransactionDetail";
import React from "react";
import { useTranslation } from "react-i18next";

type LegacyMagistrateDetailProps = {
	isOpen: boolean;
	senderWallet?: ReadWriteWallet;
	transaction: any;
	wallet: any;
	onClose?: any;
};

export const LegacyMagistrateDetail = ({
	isOpen,
	senderWallet,
	transaction,
	wallet,
	onClose,
}: LegacyMagistrateDetailProps) => {
	const { t } = useTranslation();

	const titles: Record<string, string> = {
		legacyBusinessRegistration: t("TRANSACTION.TRANSACTION_TYPES.LEGACY_BUSINESS_REGISTRATION"),
		legacyBusinessResignation: t("TRANSACTION.TRANSACTION_TYPES.LEGACY_BUSINESS_RESIGNATION"),
		legacyBusinessUpdate: t("TRANSACTION.TRANSACTION_TYPES.LEGACY_BUSINESS_UPDATE"),
		legacyBridgechainRegistration: t("TRANSACTION.TRANSACTION_TYPES.LEGACY_BRIDGECHAIN_REGISTRATION"),
		legacyBridgechainResignation: t("TRANSACTION.TRANSACTION_TYPES.LEGACY_BRIDGECHAIN_RESIGNATION"),
		legacyBridgechainUpdate: t("TRANSACTION.TRANSACTION_TYPES.LEGACY_BRIDGECHAIN_UPDATE"),
	};

	return (
		<Modal title={titles[transaction.type()]} isOpen={isOpen} onClose={onClose}>
			<TransactionSender
				address={transaction.sender()}
				wallet={senderWallet}
				border={false}
			/>

			<TransactionFee currency={wallet.currency()} value={transaction.fee()} />

			<TransactionTimestamp timestamp={transaction.timestamp()} />

			<TransactionConfirmations
				isConfirmed={transaction.isConfirmed()}
				confirmations={transaction.confirmations()}
			/>

			<TransactionExplorerLink id={transaction.id()} link={transaction.explorerLink()} />

			{transaction.blockId() && (
				<TransactionExplorerLink
					id={transaction.blockId()}
					link={transaction.explorerLinkForBlock()}
					variant="block"
				/>
			)}
		</Modal>
	);
};

LegacyMagistrateDetail.defaultProps = {
	isOpen: false,
};
