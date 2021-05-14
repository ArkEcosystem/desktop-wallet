import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { fireEvent } from "@testing-library/react";
import React from "react";
import { act, env, getDefaultProfileId, render, waitFor } from "testing-library";

import { translations } from "../../i18n";
import { SearchRecipient } from "./SearchRecipient";

let profile: Contracts.IProfile;

describe("SearchRecipient", () => {
	let newContact: Contracts.IContact;

	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		await env.profiles().restore(profile);

		newContact = profile.contacts().create("New Contact");
		await profile.contacts().update(newContact.id(), {
			addresses: [
				{
					coin: "ARK",
					network: "ark.devnet",
					name: "DFJ5Z51F1euNNdRUQJKQVdG4h495LZkc6T",
					address: "DFJ5Z51F1euNNdRUQJKQVdG4h495LZkc6T",
				},
				{
					coin: "ARK",
					network: "ark.devnet",
					name: "D9YiyRYMBS2ofzqkufjrkB9nHofWgJLM7f",
					address: "D9YiyRYMBS2ofzqkufjrkB9nHofWgJLM7f",
				},
				{
					coin: "ARK",
					network: "ark.devnet",
					name: "DKrACQw7ytoU2gjppy3qKeE2dQhZjfXYqu",
					address: "DKrACQw7ytoU2gjppy3qKeE2dQhZjfXYqu",
				},
			],
		});
	});

	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(
			<SearchRecipient isOpen={false} profile={profile} onAction={jest.fn} />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(
			<SearchRecipient isOpen={true} profile={profile} onAction={jest.fn} />,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SEARCH_RECIPIENT.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SEARCH_RECIPIENT.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal with custom title and description", () => {
		const title = "Modal title";
		const description = "Modal description";
		const { asFragment, getByTestId } = render(
			<SearchRecipient
				isOpen={true}
				profile={profile}
				title={title}
				description={description}
				onAction={jest.fn()}
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent("Modal title");
		expect(getByTestId("modal__inner")).toHaveTextContent("Modal description");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should not render recipient if not in same network", () => {
		const coin = profile.coins().set("ARK", "ark.mainnet");

		const { asFragment, getByTestId } = render(
			<SearchRecipient isOpen={true} profile={profile} network={coin.network()} onAction={jest.fn()} />,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SEARCH_RECIPIENT.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SEARCH_RECIPIENT.DESCRIPTION);
		expect(() => getByTestId("TableRow")).toThrow();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should not render recipient if not in same network", () => {
		const coin = profile.coins().set("ARK", "ark.devnet");
		const mockContactNetwork = jest.spyOn(newContact.addresses().last(), "network").mockReturnValue("ark.mainnet");
		const { asFragment, getByTestId } = render(
			<SearchRecipient isOpen={true} profile={profile} network={coin.network()} onAction={jest.fn()} />,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SEARCH_RECIPIENT.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SEARCH_RECIPIENT.DESCRIPTION);
		expect(() => getByTestId("TableRow")).toThrow();
		expect(asFragment()).toMatchSnapshot();
		mockContactNetwork.mockRestore();
	});

	it("should not render recipient if network is missing", async () => {
		const onAction = jest.fn();
		const { getAllByTestId, getByTestId } = render(
			<SearchRecipient isOpen={true} profile={profile} onAction={onAction} />,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SEARCH_RECIPIENT.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SEARCH_RECIPIENT.DESCRIPTION);
		await waitFor(() => expect(getAllByTestId("RecipientListItem__select-button").length).toBeGreaterThan(0));

		act(() => {
			fireEvent.click(getAllByTestId("RecipientListItem__select-button")[0]);
		});

		expect(onAction).toHaveBeenCalled();
	});
});
