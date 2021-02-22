import React from "react";
import { fireEvent, render } from "testing-library";

import { Card } from "./Card";

describe("Card", () => {
	it("should render", () => {
		const { container, asFragment } = render(<Card />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle click", () => {
		const handleClick = jest.fn();
		const { container, asFragment, getByText } = render(<Card onClick={() => handleClick()}>Test</Card>);

		expect(container).toBeTruthy();
		fireEvent.click(getByText("Test"));

		expect(handleClick).toHaveBeenCalled();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should selected", () => {
		const { container, asFragment } = render(<Card isSelected={true} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
