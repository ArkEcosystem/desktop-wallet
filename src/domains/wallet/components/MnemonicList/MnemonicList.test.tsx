import { render } from "@testing-library/react";
import React from "react";

import { MnemonicList } from "./MnemonicList";

describe("MnemonicList", () => {
	const mnemonic = ["lorem", "ipsum", "dolor", "sit", "amet"];

	it("should contain mnemonic words", () => {
		const { getAllByTestId, asFragment } = render(<MnemonicList mnemonic={mnemonic} />);
		const words = getAllByTestId("MnemonicList__item");
		expect(words.length).toEqual(mnemonic.length);
		expect(words[0]).toHaveTextContent(mnemonic[0]);
		expect(asFragment()).toMatchSnapshot();
	});
});
