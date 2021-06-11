import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";
import { render } from "testing-library";

import { TotalAmountBox } from "./TotalAmountBox";

describe("TotalAmountBox", () => {
	it("should render", () => {
		const fee = "1000000";
		const { asFragment, getByTestId } = render(
			<TotalAmountBox amount={BigNumber.make(10000000)} fee={fee} ticker="ARK" />,
		);

		expect(asFragment()).toMatchSnapshot();
		expect(getByTestId("total-amount-box__transaction-amount")).toHaveTextContent("0.1 ARK");
		expect(getByTestId("total-amount-box__transaction-fee")).toHaveTextContent("0.01 ARK");
		expect(getByTestId("total-amount-box__total")).toHaveTextContent("0.11 ARK");
	});
});
