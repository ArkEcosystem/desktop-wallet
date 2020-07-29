/* eslint-disable @typescript-eslint/require-await */
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment, Profile } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { Route } from "react-router-dom";
import fixtureData from "tests/fixtures/env/storage.json";
import { StubStorage } from "tests/mocks";
import { act, fireEvent, RenderResult, renderWithRouter, waitFor, within } from "utils/testing-library";

import { translations } from "../../i18n";
import { Contacts } from "./Contacts";

let env: Environment;
let profile: Profile;
let firstContactId: string;

let rendered: RenderResult;
const history = createMemoryHistory();

describe("Contacts", () => {
	beforeAll(() => {
		nock.disableNetConnect();

		nock("https://dwallets.ark.io")
			.get("/api/node/configuration")
			.reply(200, require("../../../../tests/fixtures/coins/ark/configuration-devnet.json"))
			.get("/api/peers")
			.reply(200, require("../../../../tests/fixtures/coins/ark/peers.json"))
			.get("/api/node/configuration/crypto")
			.reply(200, require("../../../../tests/fixtures/coins/ark/cryptoConfiguration.json"))
			.get("/api/node/syncing")
			.reply(200, require("../../../../tests/fixtures/coins/ark/syncing.json"))
			.get("/api/wallets/D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD")
			.reply(200, require("../../../../tests/fixtures/coins/ark/syncing.json"))
			.get("/api/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib")
			.reply(200, require("../../../../tests/fixtures/coins/ark/wallet.json"))
			.persist();
	});

	// describe("without contacts", () => {
	// 	it("should render empty", () => {
	// 		history.push(contactsURL);

	// 		const { asFragment, getByTestId } = renderWithRouter(
	// 			<Route path="/profiles/:profileId/contacts">
	// 				<Contacts />
	// 			</Route>,
	// 			{
	// 				routes: [contactsURL],
	// 				history,
	// 			},
	// 		);

	// 		expect(getByTestId("header__title")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
	// 		expect(getByTestId("header__subtitle")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

	// 		expect(getByTestId("contacts__banner")).toBeTruthy();

	// 		expect(asFragment()).toMatchSnapshot();
	// 	});
	// });

	describe("with contacts", () => {
		beforeEach(async () => {
			env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });

			await env.bootFromObject(fixtureData);
			profile = env.profiles().findById("b999d134-7a24-481e-a95d-bc47c543bfc9");

			firstContactId = profile.contacts().values()[0].id();

			// await contact.addresses().create(
			// 	{
			// 		coin: "ARK",
			// 		network: "devnet",
			// 		name: "Jane's Devnet Address",
			// 		address: "D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib",
			// 	}
			// );

			const contactsURL = `/profiles/${profile.id()}/contacts`;
			history.push(contactsURL);

			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/contacts">
					<Contacts />
				</Route>,
				{
					routes: [contactsURL],
					history,
				},
			);
		});

		it("should render with contacts", () => {
			const { asFragment, getByTestId } = rendered;

			expect(getByTestId("header__title")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
			expect(getByTestId("header__subtitle")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

			expect(() => getByTestId("contacts__banner")).toThrow(/Unable to find an element by/);

			expect(asFragment()).toMatchSnapshot();
		});

		it.each([
			["close", "modal__close-btn"],
			["cancel", "contact-form__cancel-btn"],
			["save", "contact-form__save-btn"],
		])("should open & close add contact modal (%s)", async (_, buttonId) => {
			const { getAllByTestId, getByTestId, queryByTestId, debug } = rendered;

			fireEvent.click(getByTestId("contacts__add-contact-btn"));

			if (buttonId === "contact-form__save-btn") {
				expect(getByTestId("contact-form__save-btn")).toBeDisabled();
				expect(getByTestId("contact-form__add-address-btn")).toBeDisabled();

				const assetInput = getByTestId("SelectNetworkInput__input");

				expect(() => getAllByTestId("contact-form__address-list-item")).toThrow(/Unable to find an element by/);

				act(() => {
					fireEvent.change(getByTestId("contact-form__address-input"), {
						target: { value: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD" },
					});

					fireEvent.change(getByTestId("contact-form__name-input"), {
						target: { value: "name" },
					});

					fireEvent.click(getByTestId("NetworkIcon-ARK-Devnet"));
				});

				await waitFor(() => expect(queryByTestId("contact-form__add-address-btn")).not.toBeDisabled());

				act(() => {
					fireEvent.click(getByTestId("contact-form__add-address-btn"));
				});

				await waitFor(() => expect(getAllByTestId("contact-form__address-list-item")).toHaveLength(1));
			}

			await waitFor(() => expect(queryByTestId(buttonId)).not.toBeDisabled());

			expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CREATE_CONTACT.TITLE);
			expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CREATE_CONTACT.DESCRIPTION);

			act(() => {
				fireEvent.click(getByTestId(buttonId));
			});

			await waitFor(() => expect(queryByTestId("modal__inner")).toBeNull());

			// Check if contact is created
			if (buttonId === "contact-form__save-btn") {
				expect(profile.contacts().findByAddress("D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD").length).toBe(1);
			}
		});

		it("should open delete contact modal", async () => {
			const { getByTestId } = rendered;

			expect(getByTestId("header__title")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
			expect(getByTestId("header__subtitle")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

			await waitFor(() => {
				expect(getByTestId("ContactList")).toBeTruthy();
			});

			const firstContactOptionsDropdown = within(getByTestId("ContactList")).getAllByTestId("dropdown__toggle")[0];
			expect(firstContactOptionsDropdown).toBeTruthy();

			act(() => {
				fireEvent.click(firstContactOptionsDropdown);
			});

			expect(getByTestId("dropdown__options")).toBeTruthy();
			const deleteOption = getByTestId("dropdown__option--2");

			act(() => {
				fireEvent.click(deleteOption);
			});
			expect(getByTestId("modal__inner")).toBeTruthy();
		});

		it("should close contact deletion modal", async () => {
			const { getByTestId } = rendered;

			expect(getByTestId("header__title")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
			expect(getByTestId("header__subtitle")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

			await waitFor(() => {
				expect(getByTestId("ContactList")).toBeTruthy();
			});

			const firstContactOptionsDropdown = within(getByTestId("ContactList")).getAllByTestId("dropdown__toggle")[0];
			expect(firstContactOptionsDropdown).toBeTruthy();

			act(() => {
				fireEvent.click(firstContactOptionsDropdown);
			});

			expect(getByTestId("dropdown__options")).toBeTruthy();
			const deleteOption = getByTestId("dropdown__option--2");

			act(() => {
				fireEvent.click(deleteOption);
			});

			expect(getByTestId("modal__inner")).toBeTruthy();

			act(() => {
				fireEvent.click(getByTestId("modal__close-btn"));
			});

			waitFor(() => {
				expect(() => getByTestId("modal__inner")).toBeFalsy();
			});
		});

		it("should cancel contact deletion modal", async () => {
			const { getByTestId } = rendered;

			expect(getByTestId("header__title")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
			expect(getByTestId("header__subtitle")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

			await waitFor(() => {
				expect(getByTestId("ContactList")).toBeTruthy();
			});

			const firstContactOptionsDropdown = within(getByTestId("ContactList")).getAllByTestId("dropdown__toggle")[0];
			expect(firstContactOptionsDropdown).toBeTruthy();

			act(() => {
				fireEvent.click(firstContactOptionsDropdown);
			});

			expect(getByTestId("dropdown__options")).toBeTruthy();
			const deleteOption = getByTestId("dropdown__option--2");

			act(() => {
				fireEvent.click(deleteOption);
			});

			expect(getByTestId("modal__inner")).toBeTruthy();

			act(() => {
				fireEvent.click(getByTestId("DeleteResource__cancel-button"));
			});

			waitFor(() => {
				expect(getByTestId("modal__inner")).toBeFalsy();
			});
		});

		it("ignore random contact item action", async () => {
			const { getByTestId } = rendered;

			expect(getByTestId("header__title")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
			expect(getByTestId("header__subtitle")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

			await waitFor(() => {
				expect(getByTestId("ContactList")).toBeTruthy();
			});

			const firstContactOptionsDropdown = within(getByTestId("ContactList")).getAllByTestId("dropdown__toggle")[0];
			expect(firstContactOptionsDropdown).toBeTruthy();

			act(() => {
				fireEvent.click(firstContactOptionsDropdown);
			});

			expect(getByTestId("dropdown__options")).toBeTruthy();

			act(() => {
				fireEvent.click(getByTestId("dropdown__option--1"));
			});

			waitFor(() => {
				expect(getByTestId("dropdown__options")).toBeFalsy();
			});
		});

		it("should delete contact from modal", async () => {
			const { getByTestId } = rendered;

			expect(getByTestId("header__title")).toHaveTextContent(translations.CONTACTS_PAGE.TITLE);
			expect(getByTestId("header__subtitle")).toHaveTextContent(translations.CONTACTS_PAGE.SUBTITLE);

			await waitFor(() => {
				expect(getByTestId("ContactList")).toBeTruthy();
			});

			const firstContactOptionsDropdown = within(getByTestId("ContactList")).getAllByTestId("dropdown__toggle")[0];
			expect(firstContactOptionsDropdown).toBeTruthy();

			act(() => {
				fireEvent.click(firstContactOptionsDropdown);
			});

			expect(getByTestId("dropdown__options")).toBeTruthy();
			const deleteOption = getByTestId("dropdown__option--2");

			act(() => {
				fireEvent.click(deleteOption);
			});

			expect(getByTestId("modal__inner")).toBeTruthy();

			act(() => {
				fireEvent.click(getByTestId("DeleteResource__submit-button"));
			});

			expect(() => profile.contacts().findById(firstContactId)).toThrowError("Failed to find");
		});
	});
});
