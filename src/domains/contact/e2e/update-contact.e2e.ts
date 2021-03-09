import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture } from "../../../utils/e2e-utils";
import { goToContacts } from "./common";

const translations = buildTranslations();

createFixture(`Update contact`).beforeEach(async (t) => await goToContacts(t));

test("should open and close contact update modal", async (t) => {
	await t.click(
		Selector('[data-testid="ContactList"] tbody > tr:first-child [data-testid="dropdown__toggle"]').child(0),
	);
	await t.click(
		Selector('[data-testid="ContactList"] tbody > tr:first-child [data-testid="dropdown__option--1"]').withText(
			translations.COMMON.EDIT,
		),
	);
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_UPDATE_CONTACT.TITLE).exists,
		)
		.ok();
	await t.click(Selector('[data-testid="modal__close-btn"]'));
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_UPDATE_CONTACT.TITLE).exists,
		)
		.notOk();
});

test("should open and cancel contact update modal", async (t) => {
	await t.click(
		Selector('[data-testid="ContactList"] tbody > tr:first-child [data-testid="dropdown__toggle"]').child(0),
	);
	await t.click(
		Selector('[data-testid="ContactList"] tbody > tr:first-child [data-testid="dropdown__option--1"]').withText(
			translations.COMMON.EDIT,
		),
	);
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_UPDATE_CONTACT.TITLE).exists,
		)
		.ok();
	await t.hover(Selector('[data-testid="contact-form__cancel-btn"]'));
	await t.click(Selector('[data-testid="contact-form__cancel-btn"]'));
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_UPDATE_CONTACT.TITLE).exists,
		)
		.notOk();
});

test("should successfully update contact", async (t) => {
	await t.expect(Selector('[data-testid="ContactList"] tbody > tr:first-child td').withText("Brian").exists).ok();
	await t
		.expect(Selector('[data-testid="ContactList"] tbody > tr:first-child td').withText("Anne Doe").exists)
		.notOk();

	await t.click(
		Selector('[data-testid="ContactList"] tbody > tr:first-child [data-testid="dropdown__toggle"]').child(0),
	);
	await t.click(
		Selector('[data-testid="ContactList"] tbody > tr:first-child [data-testid="dropdown__option--1"]').withText(
			translations.COMMON.EDIT,
		),
	);
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_UPDATE_CONTACT.TITLE).exists,
		)
		.ok();

	const nameInput = Selector('[data-testid="contact-form__name-input"]');
	await t.typeText(nameInput, "Anne Doe", { replace: true });

	// Save
	await t.expect(Selector('[data-testid="contact-form__save-btn"]').hasAttribute("disabled")).notOk();
	await t.hover(Selector('[data-testid="contact-form__save-btn"]'));
	await t.click(Selector('[data-testid="contact-form__save-btn"]'));

	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_UPDATE_CONTACT.TITLE).exists,
		)
		.notOk();

	await t.expect(Selector('[data-testid="ContactList"] tbody > tr:first-child td').withText("Brian").exists).notOk();
	await t.expect(Selector('[data-testid="ContactList"] tbody > tr:first-child td').withText("Anne Doe").exists).ok();
});

test("should error for invalid address", async (t) => {
	await t.expect(Selector('[data-testid="ContactList"] tbody > tr:first-child td').withText("Brian").exists).ok();
	await t
		.expect(Selector('[data-testid="ContactList"] tbody > tr:first-child td').withText("Anne Doe").exists)
		.notOk();

	await t.click(
		Selector('[data-testid="ContactList"] tbody > tr:first-child [data-testid="dropdown__toggle"]').child(0),
	);
	await t.click(
		Selector('[data-testid="ContactList"] tbody > tr:first-child [data-testid="dropdown__option--1"]').withText(
			translations.COMMON.EDIT,
		),
	);
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_UPDATE_CONTACT.TITLE).exists,
		)
		.ok();

	await t.typeText(Selector('[data-testid="SelectNetworkInput__input"]'), "ARK Devnet");
	await t.pressKey("enter");

	const addressInput = Selector('[data-testid="contact-form__address-input"]');
	await t.typeText(addressInput, "invalid address");
	await t.expect(Selector('[data-testid="contact-form__add-address-btn"]').hasAttribute("disabled")).notOk();

	// Add address
	await t.hover(Selector('[data-testid="contact-form__add-address-btn"]'));
	await t.click(Selector('[data-testid="contact-form__add-address-btn"]'));
	await t.expect(Selector('[data-testid="Input-error"]').exists).ok();

	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_UPDATE_CONTACT.TITLE).exists,
		)
		.ok();
});

test("should error on duplicate address addition", async (t) => {
	await t.expect(Selector('[data-testid="ContactList"] tbody > tr:first-child td').withText("Brian").exists).ok();
	await t
		.expect(Selector('[data-testid="ContactList"] tbody > tr:first-child td').withText("Anne Doe").exists)
		.notOk();

	await t.click(
		Selector('[data-testid="ContactList"] tbody > tr:first-child [data-testid="dropdown__toggle"]').child(0),
	);
	await t.click(
		Selector('[data-testid="ContactList"] tbody > tr:first-child [data-testid="dropdown__option--1"]').withText(
			translations.COMMON.EDIT,
		),
	);
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_UPDATE_CONTACT.TITLE).exists,
		)
		.ok();

	await t.typeText(Selector('[data-testid="SelectNetworkInput__input"]'), "ARK Devnet");
	await t.pressKey("enter");

	const addressInput = Selector('[data-testid="contact-form__address-input"]');
	await t.typeText(addressInput, "D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib");
	await t.expect(Selector('[data-testid="contact-form__add-address-btn"]').hasAttribute("disabled")).notOk();

	// Add address
	await t.click(Selector('[data-testid="contact-form__add-address-btn"]'));
	await t.expect(Selector('[data-testid="Input-error"]').exists).ok();

	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_UPDATE_CONTACT.TITLE).exists,
		)
		.ok();
});

test("should error if contact name is already taken", async (t) => {
	const newContact = "Test contact";

	await t.click(Selector('[data-testid="contacts__add-contact-btn"]'));
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_CREATE_CONTACT.TITLE).exists,
		)
		.ok();

	const nameInput = Selector('[data-testid="contact-form__name-input"]');
	await t.typeText(nameInput, newContact);

	await t.typeText(Selector('[data-testid="SelectNetworkInput__input"]'), "ARK Devnet");
	await t.pressKey("enter");

	const addressInput = Selector('[data-testid="contact-form__address-input"]');
	await t.typeText(addressInput, "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax");
	await t.expect(Selector('[data-testid="contact-form__add-address-btn"]').hasAttribute("disabled")).notOk();

	// Add address
	await t.click(Selector('[data-testid="contact-form__add-address-btn"]'));
	await t.expect(Selector('[data-testid="contact-form__address-list-item"]').withText("D6Z26L69").exists).ok();

	// Save
	await t.expect(Selector('[data-testid="contact-form__save-btn"]').hasAttribute("disabled")).notOk();
	await t.click(Selector('[data-testid="contact-form__save-btn"]'));

	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_CREATE_CONTACT.TITLE).exists,
		)
		.notOk();

	// Show in list
	await t
		.expect(
			Selector('[data-testid="ContactList"] [data-testid="ContactListItem__name"]').withText(newContact).exists,
		)
		.ok();

	// Rename existing contact to `Test Contact` expecting it to show 'already exists' error
	await t.expect(Selector('[data-testid="ContactList"] tbody > tr:first-child td').withText("Brian").exists).ok();
	await t
		.expect(Selector('[data-testid="ContactList"] tbody > tr:first-child td').withText("Anne Doe").exists)
		.notOk();

	await t.click(
		Selector('[data-testid="ContactList"] tbody > tr:first-child [data-testid="dropdown__toggle"]').child(0),
	);
	await t.click(
		Selector('[data-testid="ContactList"] tbody > tr:first-child [data-testid="dropdown__option--1"]').withText(
			translations.COMMON.EDIT,
		),
	);
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_UPDATE_CONTACT.TITLE).exists,
		)
		.ok();

	const name = Selector('[data-testid="contact-form__name-input"]');
	await t.typeText(name, "Test Contact", { replace: true });

	// Save
	await t.expect(Selector('[data-testid="contact-form__save-btn"]').hasAttribute("disabled")).notOk();
	await t.click(Selector('[data-testid="contact-form__save-btn"]'));

	await t.expect(Selector('[data-testid="Input-error"]').exists).ok();

	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_UPDATE_CONTACT.TITLE).exists,
		)
		.ok();
});

test("should disable save button if name consists of empty spaces", async (t) => {
	await t.expect(Selector('[data-testid="ContactList"] tbody > tr:first-child td').withText("Brian").exists).ok();
	await t
		.expect(Selector('[data-testid="ContactList"] tbody > tr:first-child td').withText("Anne Doe").exists)
		.notOk();

	await t.click(
		Selector('[data-testid="ContactList"] tbody > tr:first-child [data-testid="dropdown__toggle"]').child(0),
	);
	await t.click(
		Selector('[data-testid="ContactList"] tbody > tr:first-child [data-testid="dropdown__option--1"]').withText(
			translations.COMMON.EDIT,
		),
	);
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_UPDATE_CONTACT.TITLE).exists,
		)
		.ok();

	const nameInput = Selector('[data-testid="contact-form__name-input"]');
	await t.typeText(nameInput, "          ", { replace: true });

	// Save
	await t.expect(Selector('[data-testid="contact-form__save-btn"]').hasAttribute("disabled")).ok();
});
