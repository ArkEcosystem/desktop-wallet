import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import Tippy from "@tippyjs/react";
import { Icon } from "app/components/Icon";
import React from "react";

type Props = {
	memo?: string;
	isMultiSignature: boolean;
	isLedger?: boolean;
};

const VendorField = ({ vendorField }: { vendorField: string | undefined }) => (
	<Tippy content={vendorField}>
		<span className="p-1">
			<Icon data-testid="TransactionRowInfo__vendorField" name="Smartbridge" width={17} height={16} />
		</span>
	</Tippy>
);

const Ledger = () => (
	// TODO: i18n
	<Tippy content="Ledger">
		<span className="p-1">
			<Icon data-testid="TransactionRowInfo__ledger" name="Ledger" />
		</span>
	</Tippy>
);

const MultiSignature = () => (
	// TODO: i18n
	<Tippy content="MultiSignature">
		<span className="p-1">
			<Icon data-testid="TransactionRowInfo__multiSignature" name="Multisig" width={22} height={14} />
		</span>
	</Tippy>
);

export const BaseTransactionRowInfo = ({ memo, isMultiSignature, isLedger }: Props) => (
	<div data-testid="TransactionRowInfo" className="inline-flex space-x-1 align-middle">
		{isLedger && <Ledger />}
		{isMultiSignature && <MultiSignature />}
		{memo && <VendorField vendorField={memo} />}
	</div>
);

export const TransactionRowInfo = ({ transaction }: { transaction: ExtendedTransactionData }) => (
	<BaseTransactionRowInfo
		memo={transaction.memo()}
		isMultiSignature={transaction.isMultiSignature()}
		isLedger={transaction.wallet()?.isLedger()}
	/>
);
