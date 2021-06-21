import { render, screen } from "@testing-library/react";
import React from "react";

import { AmountFiat } from "./AmountFiat";

describe("AmountFiat", () => {
	it("should format fiat", () => {
		const { rerender } = render(<AmountFiat value={123.456} ticker="EUR" />);
		expect(screen.getByTestId("AmountFiat")).toHaveTextContent("€123.46");

		rerender(<AmountFiat value={1} ticker="EUR" />);
		expect(screen.getByTestId("AmountFiat")).toHaveTextContent("€1.00");

		rerender(<AmountFiat value={1} ticker="EUR" withSign />);
		expect(screen.getByTestId("AmountFiat")).toHaveTextContent("+ €1.00");

		rerender(<AmountFiat value={1} ticker="EUR" withSign isNegative />);
		expect(screen.getByTestId("AmountFiat")).toHaveTextContent("- €1.00");
	});
});
