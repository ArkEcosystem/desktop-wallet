export const translations: { [key: string]: any } = {
	CONTACTS_PAGE: {
		ADD_CONTACT: "Add Contact",
		EMPTY_MESSAGE:
			"It looks like you don't have any Contacts yet. After adding new Contacts, they can be viewed here.",
		TITLE: "My Contacts",
		SUBTITLE: "Manage your frequent Contacts",
		NO_CONTACTS_FOUND: `Your search query "{{query}}" does not match any Contacts.`,
	},

	CONTACT_FORM: {
		ADD_ADDRESS: "Add Address",
		ADDRESS: "Address",
		ADDRESSES: "Addresses",
		CRYPTOASSET: "Cryptoasset",
		DELETE_CONTACT: "Delete Contact",
		NAME: "Name",
	},

	MODAL_CREATE_CONTACT: {
		TITLE: "Add Contact",
		DESCRIPTION: "Specify details for the new Contact below.",
	},

	MODAL_DELETE_CONTACT: {
		TITLE: "Delete Contact",
		DESCRIPTION: "Are you sure you want to delete this Contact? This action cannot be undone.",
	},

	MODAL_UPDATE_CONTACT: {
		TITLE: "Edit Contact",
		DESCRIPTION: "Enter the information below to update or delete the Contact.",
	},

	VALIDATION: {
		NAME_EXISTS: "A Contact named '{{name}}' already exists on this profile",
		CONTACT_NAME_EXISTS: "Contact with name {{name}} already exists.",
		CONTACT_NAME_EXISTS_SUFFIX: "already exists",
		ADDRESS_IS_INVALID: "The address is not valid",
		ADDRESS_EXISTS: "Address {{address}} already exists",
		ADDRESS_EXISTS_SUFFIX: "already exists",
	},
};
