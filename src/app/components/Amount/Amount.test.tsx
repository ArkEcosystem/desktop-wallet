import React from "react";
import { render } from "utils/testing-library";

import { Amount } from "./Amount";

describe("Amount", () => {
	it("should format currency", () => {
		const { container, rerender } = render(<Amount value={123.456} ticker="EUR" />);
		expect(container).toHaveTextContent("€123.46");

		rerender(<Amount value={1} ticker="EUR" />);
		expect(container).toHaveTextContent("€1.00");
	});

	it("should format currency negative sign", () => {
		const { container, rerender } = render(
			<Amount showSign={true} isNegative={false} value={123.456} ticker="EUR" />,
		);
		expect(container).toHaveTextContent("€123.46");

		rerender(<Amount showSign={true} isNegative={true} value={-1} ticker="EUR" />);
		expect(container).toHaveTextContent("-€1.00");
	});

	it("should format crypto", () => {
		const { container, rerender } = render(<Amount value={1} ticker="ARK" />);
		expect(container).toHaveTextContent("1 ARK");

		rerender(<Amount value={123_456} ticker="BTC" />);
		expect(container).toHaveTextContent("123,456 BTC");

		rerender(<Amount value={0} ticker="DARK" />);
		expect(container).toHaveTextContent("0 DARK");
	});

	/**
	 * [CI] Node does not support the internationalization package
	 */
	it.skip("should format crypto with custom locale", () => {
		const { container } = render(<Amount value={1} ticker="ARK" locale="pt-BR" />);
		expect(container).toHaveTextContent("0,00000001 ARK");
	});
});
