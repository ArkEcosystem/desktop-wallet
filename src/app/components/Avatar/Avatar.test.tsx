import React from "react";
import { render } from "testing-library";

import { Avatar } from "./Avatar";

describe("Avatar", () => {
	it("should render", () => {
		const { getByTestId, asFragment } = render(<Avatar address="abc" />);
		expect(getByTestId("Avatar")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with hightlight", () => {
		const { getByTestId, asFragment } = render(<Avatar address="abc" highlight />);
		expect(getByTestId("Avatar")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it.each(["sm", "lg", "xl"])("should render with size", (size) => {
		const { getByTestId, asFragment } = render(<Avatar address="abc" size={size} />);
		expect(getByTestId("Avatar")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without shadow", () => {
		const { getByTestId, asFragment } = render(<Avatar address="abc" size="lg" noShadow />);
		expect(getByTestId("Avatar")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
