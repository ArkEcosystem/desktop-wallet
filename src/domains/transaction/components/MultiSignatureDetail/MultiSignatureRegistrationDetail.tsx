import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
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

type MultisignatureRegistrationDetailProps = {
	isOpen: boolean;
	transaction: ExtendedTransactionData;
	onClose?: () => void;
};

export const MultiSignatureRegistrationDetail = ({
	isOpen,
	transaction,
	onClose,
}: MultisignatureRegistrationDetailProps) => {
	const { t } = useTranslation();

	const wallet = useMemo(() => transaction.wallet(), [transaction]);

	return (
		<Modal title={t("TRANSACTION.MODAL_MULTISIGNATURE_DETAIL.STEP_1.TITLE")} isOpen={isOpen} onClose={onClose}>
			<TransactionSender
				address={transaction.sender()}
				alias={wallet.alias()}
				isDelegate={wallet.isDelegate() && !wallet.isResignedDelegate()}
				border={false}
			/>

			<TransactionFee currency={wallet.currency()} value={transaction.fee()} />

			<TransactionTimestamp timestamp={transaction.timestamp()!} />

			<TransactionConfirmations
				isConfirmed={transaction.isConfirmed()}
				confirmations={transaction.confirmations()}
			/>

			<TransactionExplorerLink id={transaction.id()} link={transaction.explorerLink()} />

			{transaction.blockId() && (
				<TransactionExplorerLink
					id={transaction.blockId()!}
					link={transaction.explorerLinkForBlock()!}
					variant="block"
				/>
			)}
		</Modal>
	);
};

MultiSignatureRegistrationDetail.defaultProps = {
	isOpen: false,
};

MultiSignatureRegistrationDetail.displayName = "MultiSignatureRegistrationDetail";
