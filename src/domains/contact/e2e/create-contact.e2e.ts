import { Selector } from "testcafe";

import { buildTranslations as translations } from "../../../app/i18n/helpers";

fixture`Create contact`.page`http://localhost:3000/`;

test("should open and close contact creation modal", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	await t.click(Selector('[data-testid="navbar__useractions"]'));
	await t
		.expect(Selector('[data-testid="dropdown__option--0"]').withText(translations().COMMON.CONTACTS).exists)
		.ok();
	await t.click(Selector('[data-testid="dropdown__option--0"]').withText(translations().COMMON.CONTACTS));

	await t.expect(Selector("h1").withText(translations().CONTACTS.CONTACTS_PAGE.TITLE).exists).ok();

	await t.click(Selector('[data-testid="contacts__add-contact-btn"]'));
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations().CONTACTS.CONTACTS_PAGE.ADD_CONTACT).exists,
		)
		.ok();
	await t.click(Selector('[data-testid="modal__close-btn"]'));
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations().CONTACTS.CONTACTS_PAGE.ADD_CONTACT).exists,
		)
		.notOk();
});

test("should open and cancel contact creation modal", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	await t.click(Selector('[data-testid="navbar__useractions"]'));
	await t
		.expect(Selector('[data-testid="dropdown__option--0"]').withText(translations().COMMON.CONTACTS).exists)
		.ok();
	await t.click(Selector('[data-testid="dropdown__option--0"]').withText(translations().COMMON.CONTACTS));

	await t.expect(Selector("h1").withText(translations().CONTACTS.CONTACTS_PAGE.TITLE).exists).ok();

	await t.click(Selector('[data-testid="contacts__add-contact-btn"]'));
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations().CONTACTS.CONTACTS_PAGE.ADD_CONTACT).exists,
		)
		.ok();
	await t.click(Selector('[data-testid="contact-form__cancel-btn"]'));
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations().CONTACTS.CONTACTS_PAGE.ADD_CONTACT).exists,
		)
		.notOk();
});

test("should succesfully create contact", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	await t.click(Selector('[data-testid="navbar__useractions"]'));
	await t
		.expect(Selector('[data-testid="dropdown__option--0"]').withText(translations().COMMON.CONTACTS).exists)
		.ok();
	await t.click(Selector('[data-testid="dropdown__option--0"]').withText(translations().COMMON.CONTACTS));

	await t.expect(Selector("h1").withText(translations().CONTACTS.CONTACTS_PAGE.TITLE).exists).ok();

	await t.click(Selector('[data-testid="contacts__add-contact-btn"]'));
	await t
		.expect(
			Selector('[data-testid="modal__inner"]').withText(translations().CONTACTS.CONTACTS_PAGE.ADD_CONTACT).exists,
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
			Selector('[data-testid="modal__inner"]').withText(translations().CONTACTS.CONTACTS_PAGE.ADD_CONTACT).exists,
		)
		.notOk();
});
