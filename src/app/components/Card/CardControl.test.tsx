import React from "react";
import { render } from "testing-library";

import { CardControl, CardControlState } from "./CardControl";

describe("Card Control", () => {
	it("should render", () => {
		const { container, asFragment } = render(<CardControl />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with a control state", () => {
		const { getByTestId, container, asFragment } = render(
			<CardControl className="grid">
				<div className="flex flex-col justify-between items-center h-full">
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
