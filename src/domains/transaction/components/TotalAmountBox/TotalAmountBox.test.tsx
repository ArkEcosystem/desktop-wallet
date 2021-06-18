import React from "react";
import { render } from "testing-library";

import { TotalAmountBox } from "./TotalAmountBox";

describe("TotalAmountBox", () => {
	it("should render", () => {
		const { asFragment, getByTestId } = render(<TotalAmountBox amount={0.1} fee={0.01} ticker="ARK" />);

		expect(asFragment()).toMatchSnapshot();
		expect(getByTestId("total-amount-box__transaction-amount")).toHaveTextContent("0.1 ARK");
		expect(getByTestId("total-amount-box__transaction-fee")).toHaveTextContent("0.01 ARK");
		expect(getByTestId("total-amount-box__total")).toHaveTextContent("0.11 ARK");
	});
});
