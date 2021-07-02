import { Modal } from "app/components/Modal";
import {
	TransactionConfirmations,
	TransactionExplorerLink,
	TransactionFee,
	TransactionSender,
	TransactionTimestamp,
} from "domains/transaction/components/TransactionDetail";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface LegacyMagistrateDetailProperties {
	isOpen: boolean;
	transaction: any;
	onClose?: any;
}

export const LegacyMagistrateDetail = ({ isOpen, transaction, onClose }: LegacyMagistrateDetailProperties) => {
	const { t } = useTranslation();

	const wallet = useMemo(() => transaction.wallet(), [transaction]);

	return (
		<Modal title={t("TRANSACTION.TRANSACTION_TYPES.MAGISTRATE")} isOpen={isOpen} onClose={onClose}>
			<TransactionSender
				address={transaction.sender()}
				alias={wallet.alias()}
				isDelegate={wallet.isDelegate() && !wallet.isResignedDelegate()}
				border={false}
			/>

			<TransactionFee currency={wallet.currency()} value={transaction.fee()} />

			<TransactionTimestamp timestamp={transaction.timestamp()} />

			<TransactionConfirmations transaction={transaction} />

			<TransactionExplorerLink id={transaction.id()} link={transaction.explorerLink()} />
		</Modal>
	);
};

LegacyMagistrateDetail.defaultProps = {
	isOpen: false,
};
