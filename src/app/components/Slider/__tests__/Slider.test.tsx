import React from "react";
import { render } from "@testing-library/react";

import { Slider } from "../Slider";

describe("Slider", () => {
	const data = [
		{
			col1: "column 1",
			col2: "column 2",
		},
	];

	const multiple = [
		{
			col1: "column 1",
			col2: "column 2",
		},
		{
			col1: "column 1",
			col2: "column 2",
		},
		{
			col1: "column 1",
			col2: "column 2",
		},
		{
			col1: "column 1",
			col2: "column 2",
		},
		{
			col1: "column 1",
			col2: "column 2",
		},
		{
			col1: "column 1",
			col2: "column 2",
		},
		{
			col1: "column 1",
			col2: "column 2",
		},
		{
			col1: "column 1",
			col2: "column 2",
		},
		{
			col1: "column 1",
			col2: "column 2",
		},
		{
			col1: "column 1",
			col2: "column 2",
		},
		{
			col1: "column 1",
			col2: "column 2",
		},
	];

	it("should render", () => {
		const { container } = render(<Slider data={data}>{() => <div>Slider item</div>}</Slider>);
		expect(container).toMatchSnapshot();
	});

	it("should render empty rows if template not provided", () => {
		const { container } = render(<Slider data={data} />);
		expect(container).toMatchSnapshot();
	});

	it("should render pagination", () => {
		const { container } = render(<Slider data={multiple} />);
		expect(container).toMatchSnapshot();
	});
});
