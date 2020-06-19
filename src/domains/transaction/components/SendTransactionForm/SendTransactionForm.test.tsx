import { render } from "@testing-library/react";
import React from "react";

import { SendTransactionForm } from "./";

describe("Recipient", () => {
	it("should render", () => {
		const { container } = render(<SendTransactionForm />);
		expect(container).toMatchSnapshot();
	});
});
