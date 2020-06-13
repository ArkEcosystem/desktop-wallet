import React from "react";
import { render } from "@testing-library/react";

import { CircleProgressBar } from "../CircleProgressBar";

describe("CircleProgressBar", () => {
	it("should render", () => {
		const { container, asFragment, getByTestId } = render(<CircleProgressBar />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
		expect(getByTestId("circle-progress-bar__progress")).toHaveTextContent("0%");
	});

	it("should render the percentage of progress", () => {
		const { container } = render(<CircleProgressBar percentage={50} />);

		expect(container).toMatchSnapshot();
	});

	it("should render the percentage color", () => {
		const { container } = render(<CircleProgressBar percentage={50} percentageColor="#333" />);

		expect(container).toMatchSnapshot();
	});

	it("should render the progress small", () => {
		const { container } = render(<CircleProgressBar percentage={50} size={5} />);

		expect(container).toMatchSnapshot();
	});

	it("should render the trail circle", () => {
		const { container } = render(
			<CircleProgressBar percentage={50} trailStrokeWidth={5} trailStrokeColor="#000" />,
		);

		expect(container).toMatchSnapshot();
	});

	it("should render the progress circle", () => {
		const { container } = render(<CircleProgressBar percentage={50} strokeWidth={5} strokeColor="#00f" />);

		expect(container).toMatchSnapshot();
	});
});
