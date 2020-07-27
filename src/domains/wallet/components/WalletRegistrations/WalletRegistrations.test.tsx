
import { Contracts } from "@arkecosystem/platform-sdk";
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { BIP39 } from "@arkecosystem/platform-sdk-crypto";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";
import React from "react";
import { act, fireEvent, render } from "testing-library";
import { mockArkHttp, StubStorage } from "tests/mocks";

import { WalletRegistrations } from "./WalletRegistrations";

let delegate: Contracts.WalletData;
let bip39GenerateMock: any;

const passphrase = "power return attend drink piece found tragic fire liar page disease combine";

beforeAll(() => {
	mockArkHttp();

	bip39GenerateMock = jest.spyOn(BIP39, "generate").mockReturnValue(passphrase);
});

afterAll(() => {
	bip39GenerateMock.mockRestore();
});

describe("WalletRegistrations", () => {
	beforeEach(async () => {
		const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
		const profile = env.profiles().create("John Doe");
		const wallet = (await profile.wallets().generate("ARK", "mainnet")).wallet;

		delegate = await wallet.delegate("test");
	});

	it("should emit actions", () => {
		const onShowAll = jest.fn();
		const onRegister = jest.fn();

		const { getByTestId } = render(
			<WalletRegistrations address="abc" isMultisig onShowAll={onShowAll} onRegister={onRegister} />,
		);
		fireEvent.click(getByTestId("WalletRegistrations__show-all"));
		fireEvent.click(getByTestId("WalletRegistrations__register"));
		expect(onShowAll).toHaveBeenCalled();
		expect(onRegister).toHaveBeenCalled();
	});

	it("should render closed", () => {
		const { getByTestId } = render(<WalletRegistrations address="abc" defaultIsOpen={false} />);
		expect(getByTestId("Collapse")).toHaveAttribute("aria-hidden", "true");
	});

	it("should toggle", () => {
		const { getByTestId } = render(<WalletRegistrations address="abc" />);
		act(() => {
			fireEvent.click(getByTestId("WalletRegistrations__toggle"));
		});
		expect(getByTestId("Collapse")).toHaveAttribute("aria-hidden", "true");
	});

	it("should show icons list", () => {
		const { getAllByTestId, asFragment } = render(
			<WalletRegistrations address="abc" hasSecondSignature isMultisig />,
		);
		expect(getAllByTestId("WalletRegistrations__icon-list__icon")).toHaveLength(2);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should show icons list with rest", () => {
		const { getByTestId } = render(
			<WalletRegistrations address="abc" hasPlugins={true} isMultisig hasSecondSignature hasBridgechains />,
		);
		expect(getByTestId("WalletRegistrations__icon-list__rest")).toHaveTextContent("+2");
	});

	it("should show delegate", () => {
		const { getByTestId, asFragment } = render(<WalletRegistrations address="abc" delegate={delegate} />);
		expect(getByTestId("WalletRegistrations__delegate")).toHaveTextContent("arkx");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should show business", () => {
		const { getByTestId } = render(<WalletRegistrations address="abc" business={{ name: "Test" }} />);
		expect(getByTestId("WalletRegistrations__business")).toHaveTextContent("Test");
	});

	it("should render empty mode", () => {
		const { getByTestId, asFragment } = render(<WalletRegistrations address="abc" />);
		expect(getByTestId("WalletRegistrations__empty")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
