import React from "react";
import { render } from "@testing-library/react";
import { WalletMnemonicList } from "../WalletMnemonicList";

describe("WalletMnemonicList", () => {
	const mnemonic = ["lorem", "ipsum", "dolor", "sit", "amet"];

	it("should contain mnemonic words", () => {
		const { getAllByTestId, asFragment } = render(<WalletMnemonicList mnemonic={mnemonic} />);
		const words = getAllByTestId("WalletMnemonicList__item");
		expect(words.length).toEqual(mnemonic.length);
		expect(words[0]).toHaveTextContent(mnemonic[0]);
		expect(asFragment()).toMatchSnapshot();
	});
});
