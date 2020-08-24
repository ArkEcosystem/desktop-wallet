import { Contracts } from "@arkecosystem/platform-sdk";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render } from "testing-library";

import { WalletRegistrations } from "./WalletRegistrations";

let delegate: Contracts.WalletData;

describe("WalletRegistrations", () => {
	beforeEach(async () => {
		const profile = env.profiles().findById(getDefaultProfileId());
		const wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");

		delegate = await wallet.client().delegate("test");
	});

	it("should emit actions", () => {
		const onShowAll = jest.fn();
		const onRegister = jest.fn();

		const { getByTestId } = render(
			<WalletRegistrations isMultisig onShowAll={onShowAll} onRegister={onRegister} />,
		);
		fireEvent.click(getByTestId("WalletRegistrations__show-all"));
		fireEvent.click(getByTestId("WalletRegistrations__register"));
		expect(onShowAll).toHaveBeenCalled();
		expect(onRegister).toHaveBeenCalled();
	});

	it("should render closed", () => {
		const { getByTestId } = render(<WalletRegistrations defaultIsOpen={false} />);
		expect(getByTestId("Collapse")).toHaveAttribute("aria-hidden", "true");
	});

	it("should render loading state", () => {
		const { getByTestId, asFragment } = render(<WalletRegistrations isLoading={true} />);

		expect(getByTestId("WalletRegistrations__skeleton")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should toggle", () => {
		const { getByTestId } = render(<WalletRegistrations />);
		act(() => {
			fireEvent.click(getByTestId("WalletRegistrations__toggle"));
		});
		expect(getByTestId("Collapse")).toHaveAttribute("aria-hidden", "true");
	});

	it("should show icons list", () => {
		const { getAllByTestId, asFragment } = render(<WalletRegistrations hasSecondSignature isMultisig />);
		expect(getAllByTestId("WalletRegistrations__icon-list__icon")).toHaveLength(2);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should show icons list with rest", () => {
		const { getByTestId } = render(
			<WalletRegistrations delegate={delegate} hasPlugins={true} isMultisig hasSecondSignature hasBridgechains />,
		);
		expect(getByTestId("WalletRegistrations__icon-list__rest")).toHaveTextContent("+2");
	});

	it("should show delegate", () => {
		const { getByTestId, asFragment } = render(<WalletRegistrations delegate={delegate} />);
		expect(getByTestId("WalletRegistrations__delegate")).toHaveTextContent("arkx");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should show business", () => {
		const { getByTestId } = render(<WalletRegistrations business={{ name: "Test" }} />);
		expect(getByTestId("WalletRegistrations__business")).toHaveTextContent("Test");
	});

	it("should render empty mode", () => {
		const { getByTestId, asFragment } = render(<WalletRegistrations />);
		expect(getByTestId("WalletRegistrations__empty")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
