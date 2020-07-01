import React from "react";
import { render } from "test-utils";

import { addressListData } from "../../data";
import { AddressList } from "./AddressList";

describe("AddressList", () => {
	it("should render", () => {
		const { container, asFragment } = render(<AddressList data={addressListData} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with empty list", () => {
		const { container, asFragment } = render(<AddressList data={[]} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
