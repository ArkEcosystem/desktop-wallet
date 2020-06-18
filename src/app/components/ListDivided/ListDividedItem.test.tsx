import { render } from "@testing-library/react";
import React from "react";

import { ListDividedItem } from "./ListDividedItem";

describe("ListDividedItem", () => {
	it("should render an ListDividedItem", () => {
		const { container, asFragment } = render(<ListDividedItem />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render as floating label", () => {
		const { getByTestId, asFragment } = render(<ListDividedItem isFloatingLabel />);

		expect(getByTestId("list-divided-item__inner-wrapper")).toHaveClass("flex-col items-start");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render the label", () => {
		const { getByTestId, asFragment } = render(<ListDividedItem label="Label" />);

		expect(getByTestId("list-divided-item__label")).toHaveTextContent("Label");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render the labelDescription", () => {
		const { getByTestId, asFragment } = render(<ListDividedItem labelDescription="Label Desc" />);

		expect(getByTestId("list-divided-item__label--description")).toHaveTextContent("Label Desc");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render the value", () => {
		const { getByTestId, asFragment } = render(<ListDividedItem value="Value" />);

		expect(getByTestId("list-divided-item__value")).toHaveTextContent("Value");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render the content", () => {
		const { getByTestId, asFragment } = render(<ListDividedItem content="Content" />);

		expect(getByTestId("list-divided-item__content")).toHaveTextContent("Content");
		expect(asFragment()).toMatchSnapshot();
	});
});
