import { ARK } from "@arkecosystem/platform-sdk-ark";
import { BIP39 } from "@arkecosystem/platform-sdk-crypto";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";
import React from "react";
import { act, fireEvent, render } from "testing-library";
import { mockArkHttp, StubStorage } from "tests/mocks";

import { WalletBottomSheetMenu } from "./WalletBottomSheetMenu";

let data: any;
let bip39GenerateMock: any;

const passphrase = "power return attend drink piece found tragic fire liar page disease combine";

beforeAll(() => {
	mockArkHttp();

	bip39GenerateMock = jest.spyOn(BIP39, "generate").mockReturnValue(passphrase);
});

afterAll(() => {
	bip39GenerateMock.mockRestore();
});

describe("WalletBottomSheetMenu", () => {
	beforeEach(async () => {
		const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
		const profile = env.profiles().create("John Doe");
		const wallet = (await profile.wallets().generate("ARK", "mainnet")).wallet;

		data = [
			{
				coinClassName: "text-theme-danger-400 border-theme-danger-light",
				wallet,
			},
		];
	});

	it("should render", () => {
		const { getByTestId, asFragment } = render(<WalletBottomSheetMenu walletsData={data} />);
		expect(getByTestId("WalletBottomSheetMenu")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should show counter", () => {
		const { getByTestId } = render(<WalletBottomSheetMenu walletsData={data} />);
		expect(getByTestId("WalletBottomSheetMenu__counter")).toHaveTextContent(data.length.toString());
	});

	it("should be open", () => {
		const { getByTestId } = render(<WalletBottomSheetMenu walletsData={data} defaultIsOpen={true} />);
		expect(getByTestId("Collapse")).toHaveAttribute("aria-hidden", "false");
	});

	it("should toggle", () => {
		const { getByTestId } = render(<WalletBottomSheetMenu walletsData={data} defaultIsOpen={true} />);

		act(() => {
			fireEvent.click(getByTestId("WalletBottomSheetMenu__toggle"));
		});

		expect(getByTestId("Collapse")).toHaveAttribute("aria-hidden", "true");
	});
});
