import { RequestMock, Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { getPageURL } from "../../../utils/e2e-utils";
import { goToContacts } from "./common";

const translations = buildTranslations();

const mockRequest = (url: string, fixture: string, statusCode = 200) =>
	RequestMock()
		.onRequestTo(url)
		.respond(require(`../../../tests/fixtures/${fixture}.json`), statusCode, {
			"access-control-allow-origin": "*",
		});

fixture`Delete contact`
	.page(getPageURL())
	.requestHooks(
		mockRequest("https://dwallets.ark.io/api/node/configuration", "coins/ark/configuration-devnet"),
		mockRequest("https://dwallets.ark.io/api/peers", "coins/ark/peers"),
		mockRequest("https://dwallets.ark.io/api/node/configuration/crypto", "coins/ark/cryptoConfiguration"),
		mockRequest("https://dwallets.ark.io/api/node/syncing", "coins/ark/syncing"),
		mockRequest(
			"https://dwallets.ark.io/api/wallets/D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb",
			"coins/ark/wallets/D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb",
		),
		mockRequest(
			"https://dwallets.ark.io/api/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib",
			"coins/ark/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib",
		),
		mockRequest(
			"https://dwallets.ark.io/api/wallets/034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192",
			"coins/ark/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib",
		),
		mockRequest(
			"https://dwallets.ark.io/api/wallets/D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
			"coins/ark/wallets/D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
		),
		mockRequest("https://dwallets.ark.io/api/wallets/D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD/votes", "coins/ark/votes"),
		mockRequest("https://dwallets.ark.io/api/delegates?page=1", "coins/ark/delegates-devnet"),
		mockRequest("https://dwallets.ark.io/api/delegates?page=2", "coins/ark/delegates-devnet"),
		mockRequest("https://dwallets.ark.io/api/delegates?page=3", "coins/ark/delegates-devnet"),
		mockRequest("https://dwallets.ark.io/api/delegates?page=4", "coins/ark/delegates-devnet"),
		mockRequest("https://dwallets.ark.io/api/node/fees?days=7", "coins/ark/node-fees"),
		mockRequest("https://dwallets.ark.io/api/transactions/fees", "coins/ark/transaction-fees"),
	)
	.beforeEach(async (t) => await goToContacts(t));

test("should open and close contact deletion modal", async (t) => {
	const contactName = await Selector(
		'[data-testid="ContactList"] tbody > tr:first-child [data-testid="ContactListItem__name"]',
	).textContent;

	await t.click(Selector('[data-testid="ContactList"] tbody > tr:first-child [data-testid="dropdown__toggle"]'));
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

	await t.click(Selector('[data-testid="ContactList"] tbody > tr:first-child [data-testid="dropdown__toggle"]'));
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

	await t.click(Selector('[data-testid="ContactList"] tbody > tr:first-child [data-testid="dropdown__toggle"]'));
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
