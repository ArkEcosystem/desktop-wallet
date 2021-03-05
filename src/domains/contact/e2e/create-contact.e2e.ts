import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture } from "../../../utils/e2e-utils";
import { goToContacts } from "./common";

const translations = buildTranslations();

createFixture(`Create contact`).beforeEach(async (t) => await goToContacts(t));

test("should open and close contact creation modal", async (t) => {
	await t.click(Selector('[data-testid="contacts__add-contact-btn"]'));
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_CREATE_CONTACT.TITLE).exists,
		)
		.ok();
	await t.click(Selector('[data-testid="modal__close-btn"]'));
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_CREATE_CONTACT.TITLE).exists,
		)
		.notOk();
});

test("should open and cancel contact creation modal", async (t) => {
	await t.click(Selector('[data-testid="contacts__add-contact-btn"]'));
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_CREATE_CONTACT.TITLE).exists,
		)
		.ok();
	await t.click(Selector('[data-testid="contact-form__cancel-btn"]'));
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_CREATE_CONTACT.TITLE).exists,
		)
		.notOk();
});

test("should successfully create contact", async (t) => {
	const contactName = "Test contact";

	await t.click(Selector('[data-testid="contacts__add-contact-btn"]'));
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_CREATE_CONTACT.TITLE).exists,
		)
		.ok();

	const nameInput = Selector('[data-testid="contact-form__name-input"]');
	await t.typeText(nameInput, contactName);

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
			Selector('[data-testid="ContactList"] [data-testid="ContactListItem__name"]').withText(contactName).exists,
		)
		.ok();
});

test("should error for invalid address", async (t) => {
	const contactName = "Test contact";

	await t.click(Selector('[data-testid="contacts__add-contact-btn"]'));
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_CREATE_CONTACT.TITLE).exists,
		)
		.ok();

	const nameInput = Selector('[data-testid="contact-form__name-input"]');
	await t.typeText(nameInput, contactName);

	await t.typeText(Selector('[data-testid="SelectNetworkInput__input"]'), "ARK Devnet");
	await t.pressKey("enter");

	const addressInput = Selector('[data-testid="contact-form__address-input"]');
	await t.typeText(addressInput, "invalid address");
	await t.expect(Selector('[data-testid="contact-form__add-address-btn"]').hasAttribute("disabled")).notOk();

	// Add address
	await t.click(Selector('[data-testid="contact-form__add-address-btn"]'));

	await t.expect(Selector('[data-testid="Input-error"]').exists).ok();

	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_CREATE_CONTACT.TITLE).exists,
		)
		.ok();
});

test("should error on duplicate address addition", async (t) => {
	const contactName = "Test contact";

	await t.click(Selector('[data-testid="contacts__add-contact-btn"]'));
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_CREATE_CONTACT.TITLE).exists,
		)
		.ok();

	const nameInput = Selector('[data-testid="contact-form__name-input"]');
	await t.typeText(nameInput, contactName);

	await t.typeText(Selector('[data-testid="SelectNetworkInput__input"]'), "ARK Devnet");
	await t.pressKey("enter");

	const addressInput = Selector('[data-testid="contact-form__address-input"]');
	await t.typeText(addressInput, "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax");
	await t.expect(Selector('[data-testid="contact-form__add-address-btn"]').hasAttribute("disabled")).notOk();

	// Add address
	await t.click(Selector('[data-testid="contact-form__add-address-btn"]'));
	await t.expect(Selector('[data-testid="contact-form__address-list-item"]').withText("D6Z26L69").exists).ok();

	// Add secondary duplicate address
	await t.typeText(Selector('[data-testid="SelectNetworkInput__input"]'), "ARK Devnet");
	await t.pressKey("enter");

	await t.typeText(addressInput, "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax");
	await t.expect(Selector('[data-testid="contact-form__add-address-btn"]').hasAttribute("disabled")).notOk();

	// Add address
	await t.click(Selector('[data-testid="contact-form__add-address-btn"]'));
	await t.expect(Selector('[data-testid="contact-form__address-list-item"]').withText("D6Z26L69").exists).ok();

	await t.expect(Selector('[data-testid="Input-error"]').exists).ok();

	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_CREATE_CONTACT.TITLE).exists,
		)
		.ok();
});

test("should error if contact name already exists", async (t) => {
	const contactName = "Brian";

	await t.click(Selector('[data-testid="contacts__add-contact-btn"]'));
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_CREATE_CONTACT.TITLE).exists,
		)
		.ok();

	const nameInput = Selector('[data-testid="contact-form__name-input"]');
	await t.typeText(nameInput, contactName);

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

	await t.expect(Selector('[data-testid="Input-error"]').exists).ok();

	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_CREATE_CONTACT.TITLE).exists,
		)
		.ok();
});

test("should disable save button if name consists of empty spaces", async (t) => {
	await t.click(Selector('[data-testid="contacts__add-contact-btn"]'));
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_CREATE_CONTACT.TITLE).exists,
		)
		.ok();

	const nameInput = Selector('[data-testid="contact-form__name-input"]');
	await t.typeText(nameInput, "          ");

	await t.typeText(Selector('[data-testid="SelectNetworkInput__input"]'), "ARK Devnet");
	await t.pressKey("enter");

	const addressInput = Selector('[data-testid="contact-form__address-input"]');
	await t.typeText(addressInput, "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax");
	await t.expect(Selector('[data-testid="contact-form__add-address-btn"]').hasAttribute("disabled")).notOk();

	// Add address
	await t.click(Selector('[data-testid="contact-form__add-address-btn"]'));
	await t.expect(Selector('[data-testid="contact-form__address-list-item"]').withText("D6Z26L69").exists).ok();

	// Save
	await t.expect(Selector('[data-testid="contact-form__save-btn"]').hasAttribute("disabled")).ok();

	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_CREATE_CONTACT.TITLE).exists,
		)
		.ok();
});
