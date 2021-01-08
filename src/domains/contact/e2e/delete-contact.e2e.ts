import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture } from "../../../utils/e2e-utils";
import { goToContacts } from "./common";

const translations = buildTranslations();

createFixture("Delete contact").beforeEach(async (t) => await goToContacts(t));

test("should open and close contact deletion modal", async (t) => {
	const contactName = await Selector(
		'[data-testid="ContactList"] tbody > tr:first-child [data-testid="ContactListItem__name"]',
	).textContent;

	await t.click(
		Selector('[data-testid="ContactList"] tbody > tr:first-child [data-testid="dropdown__toggle"]').child(0),
	);
	await t.click(
		Selector('[data-testid="ContactList"] tbody > tr:first-child [data-testid="dropdown__options"] li').withText(
			translations.COMMON.DELETE,
		),
	);
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_DELETE_CONTACT.TITLE).exists,
		)
		.ok();
	await t.click(Selector('[data-testid="modal__close-btn"]'));
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_DELETE_CONTACT.TITLE).exists,
		)
		.notOk();

	await t
		.expect(
			Selector(
				'[data-testid="ContactList"] tbody > tr:first-child [data-testid="ContactListItem__name"]',
			).withText(contactName).exists,
		)
		.ok();
});

test("should open and cancel contact deletion modal", async (t) => {
	const contactName = await Selector(
		'[data-testid="ContactList"] tbody > tr:first-child [data-testid="ContactListItem__name"]',
	).textContent;

	await t.click(
		Selector('[data-testid="ContactList"] tbody > tr:first-child [data-testid="dropdown__toggle"]').child(0),
	);
	await t.click(
		Selector('[data-testid="ContactList"] tbody > tr:first-child [data-testid="dropdown__options"] li').withText(
			translations.COMMON.DELETE,
		),
	);
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_DELETE_CONTACT.TITLE).exists,
		)
		.ok();
	await t.click(Selector('[data-testid="DeleteResource__cancel-button"]'));
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_DELETE_CONTACT.TITLE).exists,
		)
		.notOk();

	await t
		.expect(
			Selector(
				'[data-testid="ContactList"] tbody > tr:first-child [data-testid="ContactListItem__name"]',
			).withText(contactName).exists,
		)
		.ok();
});

test("should delete contact", async (t) => {
	const contactNameToDelete = await Selector(
		'[data-testid="ContactList"] tbody > tr:first-child [data-testid="ContactListItem__name"]',
	).textContent;

	await t.click(
		Selector('[data-testid="ContactList"] tbody > tr:first-child [data-testid="dropdown__toggle"]').child(0),
	);
	await t.click(
		Selector('[data-testid="ContactList"] tbody > tr:first-child [data-testid="dropdown__options"] li').withText(
			translations.COMMON.DELETE,
		),
	);
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_DELETE_CONTACT.TITLE).exists,
		)
		.ok();
	await t.click(Selector('[data-testid="DeleteResource__submit-button"]'));
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations.CONTACTS.MODAL_DELETE_CONTACT.TITLE).exists,
		)
		.notOk();

	await t
		.expect(
			Selector(
				'[data-testid="ContactList"] tbody > tr:first-child [data-testid="ContactListItem__name"]',
			).withText(contactNameToDelete).exists,
		)
		.notOk();
});
