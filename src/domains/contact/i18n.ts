export const translations: { [key: string]: any } = {
	CONTACTS_PAGE: {
		ADD_CONTACT: "Add Contact",
		EMPTY_MESSAGE:
			"It looks like you don't have any Contacts yet. After adding new Contacts, they can be viewed here.",
		NO_CONTACTS_FOUND: `Your search query "{{query}}" does not match any Contacts.`,
		SUBTITLE: "Manage your frequent Contacts",
		TITLE: "My Contacts",
	},

	CONTACT_FORM: {
		ADDRESS: "Address",
		ADDRESSES: "Addresses",
		ADD_ADDRESS: "Add Address",
		CRYPTOASSET: "Cryptoasset",
		DELETE_CONTACT: "Delete Contact",
		NAME: "Name",
	},

	MODAL_CREATE_CONTACT: {
		DESCRIPTION: "Specify details for the new Contact below.",
		TITLE: "Add Contact",
	},

	MODAL_DELETE_CONTACT: {
		DESCRIPTION: "Are you sure you want to delete this Contact? This action cannot be undone.",
		TITLE: "Delete Contact",
	},

	MODAL_UPDATE_CONTACT: {
		DESCRIPTION: "Enter the information below to update or delete the Contact.",
		TITLE: "Edit Contact",
	},

	VALIDATION: {
		ADDRESS_IS_INVALID: "The address is not valid",
		CONTACT_NAME_EXISTS: "Contact with name {{name}} already exists.",
		CONTACT_NAME_EXISTS_SUFFIX: "already exists",
		NAME_EXISTS: "A Contact named '{{name}}' already exists on this profile",
	},
};
