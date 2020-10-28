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
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
type DelegateResignationDetailProps = {
	isOpen: boolean;
	transaction: any;
	onClose?: any;
};

export const DelegateResignationDetail = ({ isOpen, transaction, onClose }: DelegateResignationDetailProps) => {
	const { t } = useTranslation();

	const wallet = useMemo(() => transaction.wallet(), [transaction]);

	return (
		<Modal title={t("TRANSACTION.MODAL_DELEGATE_RESIGNATION_DETAIL.TITLE")} isOpen={isOpen} onClose={onClose}>
			<TransactionSender address={transaction.sender()} alias={wallet.alias()} border={false} />

			<TransactionDetail
				label={t("TRANSACTION.DELEGATE_NAME")}
				extra={
					<Circle className="border-theme-text" size="lg">
						<Icon name="DelegateResigned" width={19} height={20} />
					</Circle>
				}
			>
				{wallet.username()}
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

DelegateResignationDetail.defaultProps = {
	isOpen: false,
};

DelegateResignationDetail.displayName = "DelegateResignationDetail";
