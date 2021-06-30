import { render, screen } from "@testing-library/react";
import React from "react";

import { AmountCrypto } from "./AmountCrypto";

describe("AmountCrypto", () => {
	it("should format crypto", () => {
		const { rerender } = render(<AmountCrypto value={1} ticker="ARK" />);
		expect(screen.getByTestId("AmountCrypto")).toHaveTextContent(/^1 ARK$/);

		rerender(<AmountCrypto value={1234.56} ticker=" " />);
		expect(screen.getByTestId("AmountCrypto")).toHaveTextContent(/^1,234.56$/);

		rerender(<AmountCrypto value={123_456} ticker="BTC" />);
		expect(screen.getByTestId("AmountCrypto")).toHaveTextContent(/^123,456 BTC$/);

		rerender(<AmountCrypto value={0} ticker="DARK" />);
		expect(screen.getByTestId("AmountCrypto")).toHaveTextContent(/^0 DARK$/);

		rerender(<AmountCrypto value={10} ticker="ARK" showSign />);
		expect(screen.getByTestId("AmountCrypto")).toHaveTextContent(/^\+ 10 ARK$/);

		rerender(<AmountCrypto value={10} ticker="ARK" showSign isNegative />);
		expect(screen.getByTestId("AmountCrypto")).toHaveTextContent(/^- 10 ARK$/);

		rerender(<AmountCrypto value={10} ticker="ARK" showTicker={false} />);
		expect(screen.getByTestId("AmountCrypto")).toHaveTextContent(/^10$/);
	});

	/**
	 * [CI] Node does not support the internationalization package
	 */
	// eslint-disable-next-line jest/no-disabled-tests
	it.skip("should format crypto with custom locale", () => {
		render(<AmountCrypto value={0.1} ticker="ARK" locale="pt-BR" />);
		expect(screen.getByTestId("AmountCrypto")).toHaveTextContent("0,1 ARK");
	});
});
