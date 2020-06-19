import {  render } from "@testing-library/react";
import React from "react";

import { ReviewRating } from "./ReviewRating";

describe("ReviewRating", () => {
	it("should render", () => {
		const { asFragment, getByText } = render(<ReviewRating />);

		expect(asFragment()).toMatchSnapshot();
	});
});
