import { DateTime } from "@arkecosystem/platform-sdk-intl";
import React from "react";
import { render } from "testing-library";

import { TransactionTimestamp } from "./TransactionTimestamp";

const datetime = DateTime.fromUnix(1596213281);

describe("TransactionTimestamp", () => {
	it("should render", () => {
		const { container } = render(<TransactionTimestamp timestamp={datetime} />);

		expect(container).toHaveTextContent("31.07.2020 16:34:41");
		expect(container).toMatchSnapshot();
	});

	it("should render with custom format", () => {
		const { container } = render(<TransactionTimestamp timestamp={datetime} format="YYYY-MM-DD" />);

		expect(container).toHaveTextContent("2020-07-31");
		expect(container).toMatchSnapshot();
	});
});
