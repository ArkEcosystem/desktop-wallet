import { fireEvent, render } from "@testing-library/react";
import React from "react";

import { CollapseToggleButton } from "./CollapseToggleButton";

describe("CollapseToggleButton", () => {
	it("should render", () => {
		const onClick = jest.fn();
		const { getByTestId } = render(<CollapseToggleButton isOpen={false} onClick={onClick} />);
		const button = getByTestId("CollapseToggleButton");
		expect(button).toHaveTextContent("Show");
		fireEvent.click(button);
		expect(onClick).toHaveBeenCalled();
	});

	it("should render open", () => {
		const { getByTestId } = render(<CollapseToggleButton isOpen={true} />);
		const button = getByTestId("CollapseToggleButton");
		expect(button).toHaveTextContent("Hide");
	});
});
