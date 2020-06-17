import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";

import { WalletListItem } from "./WalletListItem";

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

	it("should render a button if variant is 'singleAction'", () => {
		const actions = [{ label: "Option 1", value: "1" }];

		const { container, getByTestId } = render(
			<table>
				<tbody>
					<WalletListItem actions={actions} variant="singleAction" />
				</tbody>
			</table>,
		);

		expect(() => getByTestId("dropdown__toggle")).toThrow(/Unable to find an element by/);
		expect(getByTestId("button")).toHaveTextContent(actions[0].label);
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
