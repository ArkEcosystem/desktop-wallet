import { renderHook } from "@testing-library/react-hooks";
import React from "react";
import { render } from "testing-library";

import { Slider, useSlider } from "./";

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

describe("Slider", () => {
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

	it("should render pagination on top right", () => {
		const { container } = render(<Slider data={multiple} paginationPosition="top-right" />);
		expect(container).toMatchSnapshot();
	});
});

describe("useSlider hook", () => {
	it("should return expected result", () => {
		const { result } = renderHook(() =>
			useSlider({
				container: ".slide-container",
				paginationPosition: "bottom-center",
				data: multiple,
			}),
		);
		expect(result.current.containerHeight).toBe(288);
		expect(result.current.showPagination).toBe(true);
		expect(result.current.slideStyles).toStrictEqual({ height: "192px", marginTop: "0" });
	});

	it("should adjust height based on slides per column", () => {
		const { result } = renderHook(() =>
			useSlider({
				container: ".slide-container",
				paginationPosition: "bottom-center",
				data: multiple,
				options: { slidesPerColumn: 2 },
			}),
		);
		expect(result.current.containerHeight).toBe(480);
		expect(result.current.showPagination).toBe(true);
		expect(result.current.slideStyles).toStrictEqual({ height: "192px" });
	});
});
