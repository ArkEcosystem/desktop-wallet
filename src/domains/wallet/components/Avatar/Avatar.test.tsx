import { render } from "@testing-library/react";
import React from "react";

import { Avatar } from "./Avatar";

describe("Avatar", () => {
	it("should render", () => {
		const { getByTestId, asFragment } = render(<Avatar address="abc" />);
		expect(getByTestId("Avatar")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with custom size", () => {
		const { getByTestId, asFragment } = render(<Avatar address="abc" size="small" />);
		expect(getByTestId("Avatar")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without shadow", () => {
		const { getByTestId, asFragment } = render(<Avatar address="abc" size="large" noShadow />);
		expect(getByTestId("Avatar")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
