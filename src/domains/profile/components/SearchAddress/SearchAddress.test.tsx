import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render } from "testing-library";

import { translations } from "../../i18n";
import { SearchAddress } from "./SearchAddress";

let wallets: ReadWriteWallet[];

beforeAll(async () => {
	const profile = env.profiles().findById(getDefaultProfileId());
	await profile.wallets().importByMnemonic("additional wallet", "ARK", "devnet");
	wallets = profile.wallets().values();
});

describe("SearchAddress", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<SearchAddress isOpen={false} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(<SearchAddress isOpen={true} wallets={wallets} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SEARCH_ADDRESS.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SEARCH_ADDRESS.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal with custom title and description", () => {
		const title = "Modal title";
		const description = "Modal description";
		const { asFragment, getByTestId } = render(
			<SearchAddress isOpen={true} wallets={wallets} title={title} description={description} />,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent("Modal title");
		expect(getByTestId("modal__inner")).toHaveTextContent("Modal description");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select an address", () => {
		const fn = jest.fn();
		const { getByTestId } = render(<SearchAddress isOpen={true} wallets={wallets} onAction={fn} />);
		act(() => {
			fireEvent.click(getByTestId("AddressListItem__select-0"));
		});
		const selectedWalletAddress = wallets[0]?.address();
		expect(fn).toBeCalledWith("select", selectedWalletAddress);
	});
});
