import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MnemonicVerification } from "../MnemonicVerification";

describe("MnemonicVerification", () => {
	it("should verify mnemonic", () => {
		const mnemonic = ["ark", "btc", "usd", "bnb", "eth", "ltc"];
		const limit = 6;
		const wordPositions = [1, 2, 3];
		const handleComplete = jest.fn();

		const { asFragment, getByText } = render(
			<MnemonicVerification
				mnemonic={mnemonic}
				optionsLimit={limit}
				wordPositions={wordPositions}
				handleComplete={handleComplete}
			/>,
		);

		const firstTab = asFragment();
		const wrongButton = getByText(mnemonic[4]);
		fireEvent.click(wrongButton);
		expect(firstTab).toEqual(asFragment());

		const firstButton = getByText(mnemonic[wordPositions[0] - 1]);
		fireEvent.click(firstButton);
		expect(firstTab).not.toEqual(asFragment());

		const secondButton = getByText(mnemonic[wordPositions[1] - 1]);
		fireEvent.click(secondButton);

		const thirdButton = getByText(mnemonic[wordPositions[2] - 1]);
		fireEvent.click(thirdButton);

		expect(handleComplete).toHaveBeenCalled();
	});
});
