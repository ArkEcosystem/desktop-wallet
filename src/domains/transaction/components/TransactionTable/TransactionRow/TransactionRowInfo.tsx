import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import Tippy from "@tippyjs/react";
import { Icon } from "app/components/Icon";
import React from "react";

type Props = {
	memo?: string;
	isMultiSignature: boolean;
};

const VendorField = ({ vendorField }: { vendorField: string | undefined }) => (
	<Tippy content={vendorField}>
		<span className="p-1">
			<Icon data-testid="TransactionRowInfo__vendorField" name="Smartbridge" />
		</span>
	</Tippy>
);

const MultiSignature = () => (
	// TODO: i18n
	<Tippy content="MultiSignature">
		<span className="p-1">
			<Icon data-testid="TransactionRowInfo__multiSignature" name="Multisig" />
		</span>
	</Tippy>
);

export const BaseTransactionRowInfo = ({ memo, isMultiSignature }: Props) => (
	<div data-testid="TransactionRowInfo" className="inline-flex space-x-1 align-middle">
		{isMultiSignature && <MultiSignature />}
		{memo && <VendorField vendorField={memo} />}
	</div>
);

export const TransactionRowInfo = ({ transaction }: { transaction: ExtendedTransactionData }) => (
	<BaseTransactionRowInfo memo={transaction.memo()} isMultiSignature={transaction.isMultiSignature()} />
);
