import React from "react";
import { fireEvent, renderWithRouter } from "testing-library";

import { CreateProfile } from "./CreateProfile";

describe("CreateProfile", () => {
	it("should render", () => {
		const { container, getByText, asFragment } = renderWithRouter(<CreateProfile />, {
			routes: ["/", "/profile/create"],
		});

		expect(container).toBeTruthy();
		fireEvent.click(getByText("Back"));

		expect(asFragment()).toMatchSnapshot();
	});
});
