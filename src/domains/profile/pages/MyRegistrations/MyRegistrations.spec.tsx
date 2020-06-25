import { render } from "@testing-library/react";
import React from "react";

import { MyRegistrations } from "./MyRegistrations";

describe("Welcome", () => {
	it("should render empty state", () => {
		const { getByTestId, asFragment } = render(<MyRegistrations />);

		expect(asFragment()).toMatchSnapshot();
		expect(getByTestId("my-registrations__empty-state")).toBeTruthy();
	});
});
