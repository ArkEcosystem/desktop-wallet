import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { goToContacts } from "./common";

const translations = buildTranslations();

fixture`Create contact`.page`http://localhost:3000/`.beforeEach(async (t) => await goToContacts(t));

test("should open and close contact creation modal", async (t) => {
	await t.click(Selector('[data-testid="contacts__add-contact-btn"]'));
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.CONTACTS_PAGE.ADD_CONTACT).exists,
		)
		.ok();
	await t.click(Selector('[data-testid="modal__close-btn"]'));
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.CONTACTS_PAGE.ADD_CONTACT).exists,
		)
		.notOk();
});

test("should open and cancel contact creation modal", async (t) => {
	await t.click(Selector('[data-testid="contacts__add-contact-btn"]'));
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.CONTACTS_PAGE.ADD_CONTACT).exists,
		)
		.ok();
	await t.click(Selector('[data-testid="contact-form__cancel-btn"]'));
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.CONTACTS_PAGE.ADD_CONTACT).exists,
		)
		.notOk();
});

test("should succesfully create contact", async (t) => {
	await t.click(Selector('[data-testid="contacts__add-contact-btn"]'));
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.CONTACTS_PAGE.ADD_CONTACT).exists,
		)
		.ok();

	const nameInput = Selector('[data-testid="contact-form__name-input"]');
	await t.typeText(nameInput, "Anne Doe");

	await t.click(Selector("#ContactForm__network-item-1"));

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
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.CONTACTS_PAGE.ADD_CONTACT).exists,
		)
		.notOk();
});
