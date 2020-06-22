import { render } from "@testing-library/react";
import React from "react";

import { TotalAmountBox } from "./TotalAmountBox";

describe("IpfsDetailModal", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(
			<TotalAmountBox transactionAmount="1.00" transactionFee="0.09660435" />,
		);

		expect(asFragment()).toMatchSnapshot();
		expect(getByTestId("total-amount-box__transaction-amount")).toHaveTextContent("1.00 ARK");
		expect(getByTestId("total-amount-box__transaction-fee")).toHaveTextContent("0.09660435 ARK");
		expect(getByTestId("total-amount-box__total")).toHaveTextContent("1.09660435 ARK");
	});
});
