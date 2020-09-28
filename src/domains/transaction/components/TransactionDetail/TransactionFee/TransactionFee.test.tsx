import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";
import { render } from "testing-library";

import { TransactionFee } from "./TransactionFee";

describe("TransactionFee", () => {
	it("should render", () => {
		const { container } = render(<TransactionFee currency="DARK" value={BigNumber.ONE} />);

		expect(container).toHaveTextContent("1 DARK");
		expect(container).toMatchSnapshot();
	});
});
