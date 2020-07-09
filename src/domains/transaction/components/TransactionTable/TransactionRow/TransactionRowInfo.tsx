import Tippy from "@tippyjs/react";
import { Icon } from "app/components/Icon";
import React from "react";

const VendorField = ({ vendorField }: { vendorField: string }) => {
	return (
		<Tippy content={vendorField}>
			<span className="p-1">
				<Icon data-testid="TransactionRowInfo__vendorField" name="Smartbridge" />
			</span>
		</Tippy>
	);
};

const MultiSignature = () => {
	// TODO: i18n
	return (
		<Tippy content="MultiSignature">
			<span className="p-1">
				<Icon data-testid="TransactionRowInfo__multiSignature" name="Smartbridge" />
			</span>
		</Tippy>
	);
};

type Props = {
	vendorField?: string;
	isMultiSignature?: boolean;
};

export const TransactionRowInfo = ({ vendorField, isMultiSignature }: Props) => {
	return (
		<div data-testid="TransactionRowInfo" className="flex items-center space-x-2">
			{isMultiSignature && <MultiSignature />}
			{vendorField && <VendorField vendorField={vendorField} />}
		</div>
	);
};
