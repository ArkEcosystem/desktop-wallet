import React from "react";
import { render } from "test-utils";

import { Input, InputAddonEnd, InputAddonStart, InputGroup } from "./index";

describe("InputGroup", () => {
	it("should render with element on the left", () => {
		const tree = (
			<InputGroup className="max-w-xs">
				<InputAddonStart>
					<span data-testid="start">$</span>
				</InputAddonStart>
				<Input type="text" placeholder="Amount" className="pl-13" />
			</InputGroup>
		);
		const { getByTestId, asFragment } = render(tree);
		expect(getByTestId("start")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with element on the right", () => {
		const tree = (
			<InputGroup className="max-w-xs">
				<InputAddonEnd>
					<span data-testid="end">$</span>
				</InputAddonEnd>
				<Input type="text" placeholder="Amount" className="pl-13" />
			</InputGroup>
		);
		const { getByTestId, asFragment } = render(tree);
		expect(getByTestId("end")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with both elements", () => {
		const tree = (
			<InputGroup className="max-w-xs">
				<InputAddonStart>
					<span data-testid="start">$</span>
				</InputAddonStart>
				<InputAddonEnd>
					<span data-testid="end">$</span>
				</InputAddonEnd>
				<Input type="text" placeholder="Amount" className="pl-13" />
			</InputGroup>
		);
		const { getByTestId, asFragment } = render(tree);
		expect(getByTestId("start")).toBeTruthy();
		expect(getByTestId("end")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
