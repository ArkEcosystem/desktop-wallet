import React from "react";
import { render, fireEvent } from "@testing-library/react";

import { WalletListItem } from "./WalletListItem";
import { act } from "react-dom/test-utils";

describe("WalletListItem", () => {
	it("should render", () => {
		const { container } = render(
			<table>
				<tbody>
					<WalletListItem coin="Btc" walletTypeIcons={["Star", 'Multisig", "Ledger']} />
				</tbody>
			</table>,
		);
		expect(container).toMatchSnapshot();
	});

	it("should trigger onAction callback if provided", () => {
		const fn = jest.fn();
		const options = [
			{ label: "Option 1", value: "1" },
			{ label: "Option 2", value: "2" },
		];

		const { getByTestId, container } = render(
			<table>
				<tbody>
					<WalletListItem coin="Btc" actions={options} onAction={fn} />
				</tbody>
			</table>,
		);
		const toggle = getByTestId("dropdown__toggle");
		act(() => {
			fireEvent.click(toggle);
		});

		expect(getByTestId("dropdown__content")).toBeTruthy();

		const firstOption = getByTestId("dropdown__option--0");
		expect(firstOption).toBeTruthy();

		act(() => {
			fireEvent.click(firstOption);
		});

		expect(container.querySelectorAll("ul").length).toEqual(0);
		expect(fn).toHaveBeenCalled();
	});

	it("should ignore onAction callback if not provided", () => {
		const options = [
			{ label: "Option 1", value: "1" },
			{ label: "Option 2", value: "2" },
		];

		const { getByTestId, container } = render(
			<table>
				<tbody>
					<WalletListItem coin="Btc" actions={options} />
				</tbody>
			</table>,
		);
		const toggle = getByTestId("dropdown__toggle");
		act(() => {
			fireEvent.click(toggle);
		});

		expect(getByTestId("dropdown__content")).toBeTruthy();

		const firstOption = getByTestId("dropdown__option--0");
		expect(firstOption).toBeTruthy();

		act(() => {
			fireEvent.click(firstOption);
		});

		expect(container.querySelectorAll("ul").length).toEqual(0);
	});
});
