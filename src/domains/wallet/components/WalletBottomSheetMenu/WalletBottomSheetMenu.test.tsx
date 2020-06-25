import { act, fireEvent, render } from "@testing-library/react";
import React from "react";

import { WalletBottomSheetMenu } from "./WalletBottomSheetMenu";

describe("WalletBottomSheetMenu", () => {
	const data = [
		{
			coinIcon: "Ark",
			coinClassName: "text-theme-danger-400 border-theme-danger-200",
			avatarId: "test1",
			address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
			walletName: "ARK Wallet 1",
			balance: "120 ARK",
		},
	];

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
