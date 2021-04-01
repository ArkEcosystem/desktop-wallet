import { Contracts } from "@arkecosystem/platform-sdk-profiles";

export type Option = {
	label: string;
	value: string | number;
};

export type ContactListItemProps = {
	item: any;
	options: Option[];
	variant?: "condensed";
	onAction?: (action: Option, address: any) => void;
	onSend?: (address: Contracts.IContactAddress) => void;
};
