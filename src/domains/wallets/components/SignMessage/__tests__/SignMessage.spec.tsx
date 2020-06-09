import React from "react";
import { render } from "@testing-library/react";

import { SignMessage } from "../";

describe("SignMessage", () => {
	it("should render the SignMessage", () => {
		const { asFragment } = render(<SignMessage signatoryAddress="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />);

		expect(asFragment()).toMatchSnapshot();
	});
});
