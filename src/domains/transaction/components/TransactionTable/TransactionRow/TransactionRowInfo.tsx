import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import Tippy from "@tippyjs/react";
import { Icon } from "app/components/Icon";
import React from "react";

type Props = {
	transaction: ExtendedTransactionData;
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

export const TransactionRowInfo = ({ transaction }: Props) => (
	<div data-testid="TransactionRowInfo" className="inline-flex align-middle space-x-1">
		{transaction?.isMultiSignature() && <MultiSignature />}
		{transaction?.memo() && <VendorField vendorField={transaction?.memo()} />}
	</div>
);
