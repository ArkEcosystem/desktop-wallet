import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Modal } from "app/components/Modal";
import {
	TransactionConfirmations,
	TransactionDetail,
	TransactionExplorerLink,
	TransactionFee,
	TransactionSender,
	TransactionTimestamp,
} from "domains/transaction/components/TransactionDetail";
import React from "react";
import { useTranslation } from "react-i18next";

type DelegateRegistrationDetailProps = {
	isOpen: boolean;
	senderWallet?: ReadWriteWallet;
	transaction: any;
	wallet: any;
	onClose?: any;
};

export const DelegateRegistrationDetail = ({
	isOpen,
	senderWallet,
	transaction,
	wallet,
	onClose,
 }: DelegateRegistrationDetailProps) => {
	const { t } = useTranslation();

	return (
		<Modal title={t("TRANSACTION.MODAL_DELEGATE_REGISTRATION_DETAIL.TITLE")} isOpen={isOpen} onClose={onClose}>
			<TransactionSender
				address={transaction.sender()}
				wallet={senderWallet}
				border={false}
			/>

			<TransactionDetail
				label={t("TRANSACTION.DELEGATE_NAME")}
				extra={
					<Circle className="border-theme-text" size="lg">
						<Icon name="Delegate" width={25} height={25} />
					</Circle>
				}
			>
				{transaction.username()}
			</TransactionDetail>

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

DelegateRegistrationDetail.defaultProps = {
	isOpen: false,
};

DelegateRegistrationDetail.displayName = "DelegateRegistrationDetail";
