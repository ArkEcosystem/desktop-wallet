import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";
import { render } from "testing-library";

import { TotalAmountBox } from "./TotalAmountBox";

describe("TotalAmountBox", () => {
	it("should render", () => {
		const { asFragment, getByTestId } = render(
			<TotalAmountBox amount={BigNumber.make(1e8)} fee={BigNumber.ONE} ticker="ARK" />,
		);

		expect(asFragment()).toMatchSnapshot();
		expect(getByTestId("total-amount-box__transaction-amount")).toHaveTextContent("1 ARK");
		expect(getByTestId("total-amount-box__transaction-fee")).toHaveTextContent("0.00000001 ARK");
		expect(getByTestId("total-amount-box__total")).toHaveTextContent("1.00000001 ARK");
	});
});
