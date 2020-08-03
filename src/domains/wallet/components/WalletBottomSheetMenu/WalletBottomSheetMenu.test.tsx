
import { BIP39 } from "@arkecosystem/platform-sdk-crypto";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render } from "testing-library";

import { WalletBottomSheetMenu } from "./WalletBottomSheetMenu";

let data: any;
let bip39GenerateMock: any;

const passphrase = "power return attend drink piece found tragic fire liar page disease combine";

beforeAll(() => {
	bip39GenerateMock = jest.spyOn(BIP39, "generate").mockReturnValue(passphrase);
});

afterAll(() => {
	bip39GenerateMock.mockRestore();
});

describe("WalletBottomSheetMenu", () => {
	beforeEach(() => {
		const profile = env.profiles().findById(getDefaultProfileId());
		const wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");

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
