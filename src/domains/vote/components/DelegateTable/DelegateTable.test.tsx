import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { act, fireEvent, render } from "testing-library";
import { data } from "tests/fixtures/coins/ark/delegates-devnet.json";

import { DelegateTable } from "./DelegateTable";

let delegates: ReadOnlyWallet[];

describe("DelegateTable", () => {
	beforeAll(() => {
		delegates = [0, 1, 2].map(
			(index) =>
				new ReadOnlyWallet({
					address: data[index].address,
					explorerLink: "",
					publicKey: data[index].publicKey,
					username: data[index].username,
					rank: data[index].rank,
				}),
		);
	});

	it("should render", () => {
		const { container, asFragment } = render(<DelegateTable coin="ARK" delegates={delegates} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with empty list", () => {
		const { container, asFragment } = render(<DelegateTable coin="ARK" delegates={[]} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select a delegate", () => {
		const { asFragment, getByTestId } = render(<DelegateTable coin="ARK" delegates={delegates} />);
		const selectButton = getByTestId("DelegateRow__toggle-0");

		act(() => {
			fireEvent.click(selectButton);
		});

		expect(getByTestId("DelegateTable__footer")).toBeTruthy();
		expect(getByTestId("DelegateTable__footer--votes")).toHaveTextContent("1");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should unselect a delegate", () => {
		const { asFragment, getByTestId } = render(<DelegateTable coin="ARK" delegates={delegates} />);
		const selectButton = getByTestId("DelegateRow__toggle-0");

		act(() => {
			fireEvent.click(selectButton);
		});

		expect(getByTestId("DelegateTable__footer")).toBeTruthy();
		expect(getByTestId("DelegateTable__footer--votes")).toHaveTextContent("1");

		act(() => {
			fireEvent.click(selectButton);
		});

		expect(selectButton).toHaveTextContent("Selected");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select multiple delegates", () => {
		const { asFragment, getByTestId } = render(<DelegateTable coin="LSK" delegates={delegates} />);
		const selectButtons = [0, 1, 2].map((index) => getByTestId(`DelegateRow__toggle-${index}`));

		act(() => {
			fireEvent.click(selectButtons[0]);
		});

		act(() => {
			fireEvent.click(selectButtons[1]);
		});

		act(() => {
			fireEvent.click(selectButtons[2]);
		});

		expect(getByTestId("DelegateTable__footer")).toBeTruthy();
		expect(getByTestId("DelegateTable__footer--votes")).toHaveTextContent("3");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should emit action on continue button", () => {
		const delegateAddress = delegates[0].address()!;

		const onContinue = jest.fn();
		const { container, asFragment, getByTestId } = render(
			<DelegateTable coin="ARK" delegates={delegates} onContinue={onContinue} />,
		);
		const selectButton = getByTestId("DelegateRow__toggle-0");

		act(() => {
			fireEvent.click(selectButton);
		});

		expect(getByTestId("DelegateTable__footer")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("DelegateTable__continue-button"));
		});

		expect(container).toBeTruthy();
		expect(onContinue).toHaveBeenCalledWith([delegateAddress]);
		expect(asFragment()).toMatchSnapshot();
	});
});
