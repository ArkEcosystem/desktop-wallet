import { render, screen } from "@testing-library/react";
import React from "react";

import { Amount } from "./Amount";

describe("AmountGeneric", () => {
	it("should format crypto or fiat depending on the ticker", () => {
		const { rerender } = render(<Amount value={123.456} ticker="EUR" />);

		expect(screen.getByTestId("AmountFiat")).toBeInTheDocument();
		expect(screen.queryByTestId("AmountCrypto")).not.toBeInTheDocument();

		rerender(<Amount value={123.456} ticker="ARK" />);

		expect(screen.queryByTestId("AmountFiat")).not.toBeInTheDocument();
		expect(screen.getByTestId("AmountCrypto")).toBeInTheDocument();
	});
});
