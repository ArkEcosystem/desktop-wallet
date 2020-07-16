import React from "react";
import { render } from "testing-library";

import { MnemonicList } from "./MnemonicList";

const mnemonic = "lorem ipsum dolor sit amet";

describe("MnemonicList", () => {
	it("should contain mnemonic words", () => {
		const { getAllByTestId, asFragment } = render(<MnemonicList mnemonic={mnemonic} />);
		const words = getAllByTestId("MnemonicList__item");
		expect(words.length).toEqual(mnemonic.split(" ").length);
		expect(words[0]).toHaveTextContent(mnemonic[0]);
		expect(asFragment()).toMatchSnapshot();
	});
});
