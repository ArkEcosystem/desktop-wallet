import React from "react";
import { render } from "@testing-library/react";

import { CardControl, CardControlState } from "../";

describe("Card Control", () => {
	it("should render", () => {
		const { container, asFragment } = render(<CardControl />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with a control state", () => {
		const { getByTestId, container, asFragment } = render(
			<CardControl className="grid">
				<div className="flex flex-col items-center justify-between h-full">
					<span>Bitcoin</span>
					<CardControlState />
				</div>
			</CardControl>,
		);

		expect(container).toBeTruthy();
		expect(getByTestId("card__control-state")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
