import React from "react";
import { render, RenderResult, waitFor } from "@testing-library/react";
import { act } from "@testing-library/react-hooks";

import { CircleProgressBar } from "../CircleProgressBar";

describe("CircleProgressBar", () => {
	it("should render", () => {
		const { container, asFragment, getByTestId } = render(<CircleProgressBar />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
		expect(getByTestId("circle-progress-bar__progress")).toHaveTextContent("0%");
	});

	it("should render the percentage of progress", () => {
		const { container } = render(<CircleProgressBar percentage={100} />);

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

	it("should render the progress with speed", async () => {
		let rendered: RenderResult;

		await act(async () => {
			rendered = render(<CircleProgressBar percentage={50} speed={1} />);
			await waitFor(() => expect(rendered.getByTestId("circle-progress-bar__progress")).toBeTruthy());
		});
	});
});
