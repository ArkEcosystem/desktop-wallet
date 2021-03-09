import React from "react";
import { renderWithRouter } from "utils/testing-library";

import { ImportProfile } from "./ImportProfile";

describe("ImportProfile", () => {
	it("should open profile import", () => {
		const { asFragment, getByTestId } = renderWithRouter(<ImportProfile />);
		expect(asFragment()).toMatchSnapshot();
	});
});
