import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MnemonicVerification } from "../MnemonicVerification";

describe("MnemonicVerification", () => {
	it("should verify mnemonic", () => {
		const mnemonic = ["ark", "btc", "usd", "bnb", "eth", "ltc", "etc", "lsk", "trx", "dash", "xtz", "eur"];
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
        const firstTabFragment = asFragment();
        const rightFirstButton = getByText(mnemonic[wordPositions[0] - 1]);
        fireEvent.click(rightFirstButton);
        
        const secondTabFragment = asFragment();
        expect(firstTabFragment).not.toEqual(secondTabFragment);

        const rightSecondButton = getByText(mnemonic[wordPositions[1] - 1]);
        fireEvent.click(rightSecondButton);
        
        const thirdTabFragment = asFragment();
        expect(secondTabFragment).not.toEqual(thirdTabFragment);

        const rightThirdButton = getByText(mnemonic[wordPositions[2] - 1]);
        fireEvent.click(rightThirdButton);

        expect(handleComplete).toHaveBeenCalled();
	});
});
