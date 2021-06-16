import { DTO } from "@arkecosystem/platform-sdk-profiles";
import { Icon } from "app/components/Icon";
import { Tooltip } from "app/components/Tooltip";
import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
	memo?: string;
	isMultiSignatureRegistration: boolean;
	isLedger?: boolean;
}

export const BaseTransactionRowInfo = ({ memo, isMultiSignatureRegistration, isLedger }: Props) => {
	const { t } = useTranslation();

	return (
		<div data-testid="TransactionRowInfo" className="inline-flex space-x-1 align-middle">
			{isLedger && (
				<Tooltip content={t("COMMON.LEDGER")}>
					<span className="p-1">
						<Icon data-testid="TransactionRowInfo__ledger" name="Ledger" />
					</span>
				</Tooltip>
			)}

			{isMultiSignatureRegistration && (
				<Tooltip content={t("COMMON.MULTISIGNATURE")}>
					<span className="p-1">
						<Icon data-testid="TransactionRowInfo__multiSignature" name="Multisig" width={22} height={14} />
					</span>
				</Tooltip>
			)}

			{memo && (
				<Tooltip className="break-all" content={memo}>
					<span className="p-1">
						<Icon data-testid="TransactionRowInfo__vendorField" name="Memo" width={17} height={16} />
					</span>
				</Tooltip>
			)}
		</div>
	);
};

export const TransactionRowInfo = ({ transaction }: { transaction: DTO.ExtendedTransactionData }) => (
	<BaseTransactionRowInfo
		memo={transaction.memo()}
		isMultiSignatureRegistration={transaction.isMultiSignatureRegistration()}
		isLedger={transaction.wallet()?.isLedger()}
	/>
);
