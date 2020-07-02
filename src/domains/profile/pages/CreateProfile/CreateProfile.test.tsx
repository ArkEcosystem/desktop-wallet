import React from "react";
import { MemoryRouter } from "react-router-dom";
import { fireEvent, render } from "testing-library";

import { CreateProfile } from "./CreateProfile";

describe("CreateProfile", () => {
	it("should render", () => {
		const { container, getByText, asFragment } = render(
			<MemoryRouter initialEntries={["/", "profile/create"]}>
				<CreateProfile />
			</MemoryRouter>,
		);

		expect(container).toBeTruthy();
		fireEvent.click(getByText("Back"));

		expect(asFragment()).toMatchSnapshot();
	});
});
