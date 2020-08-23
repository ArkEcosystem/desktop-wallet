import { Coins } from "@arkecosystem/platform-sdk";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render } from "testing-library";

import { translations } from "../../i18n";
import { DelegateTable } from "./DelegateTable";

let delegates: Coins.WalletDataCollection;

describe("DelegateTable", () => {
	beforeAll(async () => {
		const profile = env.profiles().findById(getDefaultProfileId());
		const wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");

		delegates = await wallet.delegates();
	});

	it("should render", () => {
		const { container, asFragment } = render(<DelegateTable delegates={delegates.items()} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with empty list", () => {
		const { container, asFragment } = render(<DelegateTable delegates={[]} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select a delegate", () => {
		const delegateName = delegates.items()[0].username()!;
		const { asFragment, getByTestId } = render(<DelegateTable delegates={delegates.items()} />);
		const selectButton = getByTestId("DelegateRow__toggle-0");

		act(() => {
			fireEvent.click(selectButton);
		});

		expect(getByTestId("DelegateTable__footer")).toHaveTextContent(delegateName);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should unselect a delegate", () => {
		const delegateName = delegates.items()[0].username()!;
		const { asFragment, getByTestId } = render(<DelegateTable delegates={delegates.items()} />);
		const selectButton = getByTestId("DelegateRow__toggle-0");

		act(() => {
			fireEvent.click(selectButton);
		});

		expect(getByTestId("DelegateTable__footer")).toHaveTextContent(delegateName);

		act(() => {
			fireEvent.click(selectButton);
		});

		expect(selectButton).toHaveTextContent("Select");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select multiple delegates", () => {
		const { asFragment, getByTestId } = render(<DelegateTable delegates={delegates.items()} />);
		const selectButton0 = getByTestId("DelegateRow__toggle-0");
		const selectButton1 = getByTestId("DelegateRow__toggle-1");
		const selectButton2 = getByTestId("DelegateRow__toggle-2");

		act(() => {
			fireEvent.click(selectButton0);
		});

		act(() => {
			fireEvent.click(selectButton1);
		});

		act(() => {
			fireEvent.click(selectButton2);
		});

		expect(getByTestId("DelegateTable__footer")).toHaveTextContent(translations.DELEGATE_LIST.SHOW_LIST);

		act(() => {
			fireEvent.click(getByTestId("DelegateTable__toggle-show-selected"));
		});

		expect(getByTestId("DelegateTable__footer")).toHaveTextContent(translations.DELEGATE_LIST.HIDE_LIST);
		expect(getByTestId("DelegateTable__footer")).toHaveTextContent(delegates.items()[0].username()!);
		expect(getByTestId("DelegateTable__footer")).toHaveTextContent(delegates.items()[1].username()!);
		expect(getByTestId("DelegateTable__footer")).toHaveTextContent(delegates.items()[2].username()!);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should emit action on continue button", () => {
		const delegateName = delegates.items()[0].username()!;
		const delegateAddress = delegates.items()[0].address()!;

		const onContinue = jest.fn();
		const { container, asFragment, getByTestId } = render(
			<DelegateTable delegates={delegates.items()} onContinue={onContinue} />,
		);
		const selectButton = getByTestId("DelegateRow__toggle-0");

		act(() => {
			fireEvent.click(selectButton);
		});

		expect(getByTestId("DelegateTable__footer")).toHaveTextContent(delegateName);

		act(() => {
			fireEvent.click(getByTestId("DelegateTable__continue-button"));
		});

		expect(container).toBeTruthy();
		expect(onContinue).toHaveBeenCalledWith(delegateAddress);
		expect(asFragment()).toMatchSnapshot();
	});
});
