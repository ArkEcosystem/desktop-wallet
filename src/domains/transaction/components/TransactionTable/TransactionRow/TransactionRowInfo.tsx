import Tippy from "@tippyjs/react";
import { Icon } from "app/components/Icon";
import React from "react";

const VendorField = ({ vendorField }: { vendorField: string }) => (
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
type Props = {
	vendorField?: string;
	isMultiSignature?: boolean;
};

export const TransactionRowInfo = ({ vendorField, isMultiSignature }: Props) => (
	<div data-testid="TransactionRowInfo" className="inline-flex align-middle space-x-1">
		{isMultiSignature && <MultiSignature />}
		{vendorField && <VendorField vendorField={vendorField} />}
	</div>
);
