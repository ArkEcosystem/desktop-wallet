import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { goToContacts } from "./common";

const translations = buildTranslations();

fixture`Update contact`.page`http://localhost:3000/`.beforeEach(async (t) => await goToContacts(t));

test("should open and close contact update modal", async (t) => {
	await t.click(Selector('[data-testid="ContactList"] tbody > tr:first-child [data-testid="dropdown__toggle"]'));
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
	await t.click(Selector('[data-testid="ContactList"] tbody > tr:first-child [data-testid="dropdown__toggle"]'));
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
	await t.click(Selector('[data-testid="contact-form__cancel-btn"]'));
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_UPDATE_CONTACT.TITLE).exists,
		)
		.notOk();
});

test("should succesfully update contact", async (t) => {
	await t.expect(Selector('[data-testid="ContactList"] tbody > tr:first-child td').withText("Brian").exists).ok();
	await t
		.expect(Selector('[data-testid="ContactList"] tbody > tr:first-child td').withText("Anne Doe").exists)
		.notOk();

	await t.click(Selector('[data-testid="ContactList"] tbody > tr:first-child [data-testid="dropdown__toggle"]'));
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
	await t.click(Selector('[data-testid="contact-form__save-btn"]'));

	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_UPDATE_CONTACT.TITLE).exists,
		)
		.notOk();

	await t.expect(Selector('[data-testid="ContactList"] tbody > tr:first-child td').withText("Brian").exists).notOk();
	await t.expect(Selector('[data-testid="ContactList"] tbody > tr:first-child td').withText("Anne Doe").exists).ok();
});
