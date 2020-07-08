import React from "react";
import { render } from "testing-library";

import { TransactionSuccessful } from "./TransactionSuccessful";

describe("TransactionSuccessful", () => {
	it("should render", () => {
		const { asFragment } = render(
			<TransactionSuccessful>
				<div />
			</TransactionSuccessful>,
		);

		expect(asFragment()).toMatchSnapshot();
	});
});
