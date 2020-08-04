export const translations: { [key: string]: any } = {
	CONTACTS_PAGE: {
		ADD_CONTACT: "Add Contact",
		ADD_CONTACT_MESSAGE: "Add your most frequent contacts for fast, easy payments",
		TITLE: "My Contacts",
		SUBTITLE: "Manage your frequent contacts",
	},
	CONTACT_FORM: {
		ADD_ADDRESS: "Add address",
		ADDRESS: "Address",
		ADDRESSES: "Addresses",
		DELETE_CONTACT: "Delete Contact",
		NAME: "Name",
		NETWORK: "Network",
	},
	MODAL_CREATE_CONTACT: {
		TITLE: "Add Contact",
		DESCRIPTION: "Enter your contacts name and addresses and add them to your list.",
	},
	MODAL_DELETE_CONTACT: {
		TITLE: "Delete Contact",
		DESCRIPTION: "Do you really want to delete this contact? Once deleted, you will not be able to restore it.",
	},
	MODAL_UPDATE_CONTACT: {
		TITLE: "Edit Contact",
	},
	MODAL_SEARCH_CONTACT: {
		TITLE: "Search Contact",
		DESCRIPTION: "Find the contact you need quickly and conveniently",
		PLACEHOLDER: "Search...",
	},
	VALIDATION: {
		MAXLENGTH_ERROR: "The Contact Name should have less than {{maxLength}} characters.",
		CONTACT_NAME_EXISTS: "Contact with name {{name}} already exists.",
		CONTACT_NAME_EXISTS_SUFFIX: "already exists",
	},
};
