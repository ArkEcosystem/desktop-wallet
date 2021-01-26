import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import { Icon } from "app/components/Icon";
import { Tooltip } from "app/components/Tooltip";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
	memo?: string;
	isMultiSignature: boolean;
	isLedger?: boolean;
};

export const BaseTransactionRowInfo = ({ memo, isMultiSignature, isLedger }: Props) => {
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

			{isMultiSignature && (
				<Tooltip content={t("COMMON.MULTISIGNATURE")}>
					<span className="p-1">
						<Icon data-testid="TransactionRowInfo__multiSignature" name="Multisig" width={22} height={14} />
					</span>
				</Tooltip>
			)}

			{memo && (
				<Tooltip className="break-all" content={memo}>
					<span className="p-1">
						<Icon data-testid="TransactionRowInfo__vendorField" name="Smartbridge" width={17} height={16} />
					</span>
				</Tooltip>
			)}
		</div>
	);
};

export const TransactionRowInfo = ({ transaction }: { transaction: ExtendedTransactionData }) => (
	<BaseTransactionRowInfo
		memo={transaction.memo()}
		isMultiSignature={transaction.isMultiSignature()}
		isLedger={transaction.wallet()?.isLedger()}
	/>
);
