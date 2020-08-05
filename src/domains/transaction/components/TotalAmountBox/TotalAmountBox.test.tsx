import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";
import { render } from "testing-library";

import { TotalAmountBox } from "./TotalAmountBox";

describe("IpfsDetailModal", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(
			<TotalAmountBox amount={BigNumber.make(1e8)} fee={BigNumber.make(1e8)} />,
		);

		expect(asFragment()).toMatchSnapshot();
		expect(getByTestId("total-amount-box__transaction-amount")).toHaveTextContent("1.00000000 ARK");
		expect(getByTestId("total-amount-box__transaction-fee")).toHaveTextContent("1.00000000 ARK");
		expect(getByTestId("total-amount-box__total")).toHaveTextContent("2.00000000 ARK");
	});
});
