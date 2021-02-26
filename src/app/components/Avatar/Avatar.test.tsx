import React from "react";
import { render } from "utils/testing-library";

import { Avatar } from "./Avatar";

describe("Avatar", () => {
	it("should render", () => {
		const { getByTestId, asFragment } = render(<Avatar address="abc" />);
		expect(getByTestId("Avatar")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with highlight", () => {
		const { getByTestId, asFragment } = render(<Avatar address="abc" highlight />);
		expect(getByTestId("Avatar")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with custom shadow color", () => {
		const { getByTestId, asFragment } = render(<Avatar address="abc" shadowColor="--theme-background-color" />);
		expect(getByTestId("Avatar")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with highlight and custom shadow color", () => {
		const { getByTestId, asFragment } = render(
			<Avatar address="abc" shadowColor="--theme-background-color" highlight />,
		);
		expect(getByTestId("Avatar")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without shadow", () => {
		const { getByTestId, asFragment } = render(<Avatar address="abc" size="lg" noShadow />);
		expect(getByTestId("Avatar")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it.each(["sm", "lg", "xl"])("should render with size", (size) => {
		const { getByTestId, asFragment } = render(<Avatar address="abc" size={size} />);
		expect(getByTestId("Avatar")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
