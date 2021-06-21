import { render, screen } from "@testing-library/react";
import React from "react";

import { TotalAmountBox } from "./TotalAmountBox";

describe("TotalAmountBox", () => {
	it("should render", () => {
		const { asFragment } = render(<TotalAmountBox amount={0.1} fee={0.01} ticker="ARK" />);

		const [amount, fee, total] = screen.getAllByTestId("AmountCrypto");

		expect(amount).toHaveTextContent("0.1 ARK");
		expect(fee).toHaveTextContent("0.01 ARK");
		expect(total).toHaveTextContent("0.11 ARK");
		expect(asFragment()).toMatchSnapshot();
	});
});
