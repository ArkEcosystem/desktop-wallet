import { Contact } from "@arkecosystem/platform-sdk-profiles";

export type Option = {
	label: string;
	value: string | number;
};

export type ContactListItemProps = {
	contact: Contact;
	options: Option[];
	variant?: "condensed";
	onAction?: (action: Option, address: any) => void;
};
