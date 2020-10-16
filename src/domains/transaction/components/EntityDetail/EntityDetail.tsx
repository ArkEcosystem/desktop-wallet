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

type EntityDetailProps = {
	isOpen: boolean;
	transaction: any;
	onClose?: any;
};

export const EntityDetail = ({ isOpen, transaction, onClose }: EntityDetailProps) => {
	const { t } = useTranslation();

	const wallet = useMemo(() => transaction.wallet(), [transaction]);

	const getEntityTitle = () => {
		let entityTitle = "";

		if (transaction.isBusinessEntityRegistration()) {
			entityTitle = t("TRANSACTION.TRANSACTION_TYPES.BUSINESS_ENTITY_REGISTRATION");
		}

		if (transaction.isBusinessEntityResignation()) {
			entityTitle = t("TRANSACTION.TRANSACTION_TYPES.BUSINESS_ENTITY_RESIGNATION");
		}

		if (transaction.isBusinessEntityUpdate()) {
			entityTitle = t("TRANSACTION.TRANSACTION_TYPES.BUSINESS_ENTITY_UPDATE");
		}

		if (transaction.isProductEntityRegistration()) {
			entityTitle = t("TRANSACTION.TRANSACTION_TYPES.PRODUCT_ENTITY_REGISTRATION");
		}

		if (transaction.isProductEntityResignation()) {
			entityTitle = t("TRANSACTION.TRANSACTION_TYPES.PRODUCT_ENTITY_RESIGNATION");
		}

		if (transaction.isProductEntityUpdate()) {
			entityTitle = t("TRANSACTION.TRANSACTION_TYPES.PRODUCT_ENTITY_UPDATE");
		}

		if (transaction.isPluginEntityRegistration()) {
			entityTitle = t("TRANSACTION.TRANSACTION_TYPES.PLUGIN_ENTITY_REGISTRATION");
		}

		if (transaction.isPluginEntityResignation()) {
			entityTitle = t("TRANSACTION.TRANSACTION_TYPES.PLUGIN_ENTITY_RESIGNATION");
		}

		if (transaction.isPluginEntityUpdate()) {
			entityTitle = t("TRANSACTION.TRANSACTION_TYPES.PLUGIN_ENTITY_UPDATE");
		}

		if (transaction.isModuleEntityRegistration()) {
			entityTitle = t("TRANSACTION.TRANSACTION_TYPES.MODULE_ENTITY_REGISTRATION");
		}

		if (transaction.isModuleEntityResignation()) {
			entityTitle = t("TRANSACTION.TRANSACTION_TYPES.MODULE_ENTITY_RESIGNATION");
		}

		if (transaction.isModuleEntityUpdate()) {
			entityTitle = t("TRANSACTION.TRANSACTION_TYPES.MODULE_ENTITY_UPDATE");
		}

		return entityTitle;
	};

	return (
		<Modal title={getEntityTitle()} isOpen={isOpen} onClose={onClose}>
			<TransactionSender
				address={transaction.sender()}
				alias={wallet.alias()}
				isDelegate={wallet.isDelegate() && !wallet.isResignedDelegate()}
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

EntityDetail.defaultProps = {
	isOpen: false,
};
