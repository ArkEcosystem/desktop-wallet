import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import { translations } from "app/i18n/common/i18n";
import React from "react";
import { act, fireEvent, render } from "testing-library";
import { data } from "tests/fixtures/coins/ark/delegates-devnet.json";

import { DelegateRow } from "./DelegateRow";

let delegate: ReadOnlyWallet;

describe("DelegateRow", () => {
	beforeAll(() => {
		delegate = new ReadOnlyWallet({
			address: data[0].address,
			explorerLink: "",
			publicKey: data[0].publicKey,
			username: data[0].username,
			rank: data[0].rank,
		});
	});

	it("should render", () => {
		const { container, asFragment } = render(
			<table>
				<tbody>
					<DelegateRow index={0} delegate={delegate} />
				</tbody>
			</table>,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should emit action on select button", () => {
		const onSelect = jest.fn();
		const { container, asFragment, getByTestId } = render(
			<table>
				<tbody>
					<DelegateRow index={0} delegate={delegate} onVoteSelect={onSelect} />
				</tbody>
			</table>,
		);
		const selectButton = getByTestId("DelegateRow__toggle-0");

		act(() => {
			fireEvent.click(selectButton);
		});

		expect(container).toBeTruthy();
		expect(onSelect).toHaveBeenCalledWith(delegate.address());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render the selected delegate", () => {
		const selected = [delegate.address()];
		const { container, asFragment, getByTestId } = render(
			<table>
				<tbody>
					<DelegateRow index={1} delegate={delegate} selectedVotes={selected} />
				</tbody>
			</table>,
		);

		expect(container).toBeTruthy();
		expect(getByTestId("DelegateRow__toggle-1")).toHaveTextContent(translations.SELECTED);
		expect(asFragment()).toMatchSnapshot();
	});
});
