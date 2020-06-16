import React from "react";
import { render } from "@testing-library/react";

import { Recipient } from "./";

describe("Recipient", () => {
	it("should render", () => {
		const { container } = render(<Recipient address="Address" amount="-88.84557 ARK" />);
		expect(container).toMatchSnapshot();
	});

	it("should render without border", () => {
		const { container } = render(<Recipient address="Address" amount="-88.84557 ARK" border={false} />);
		expect(container).toMatchSnapshot();
	});
});
