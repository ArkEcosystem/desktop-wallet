import { render } from "@testing-library/react";
import React from "react";

import { ReviewRating } from "./ReviewRating";

describe("ReviewRating", () => {
	it("should render", () => {
		const { asFragment } = render(<ReviewRating />);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with total", () => {
		const { asFragment, getByTestId } = render(<ReviewRating showTotal={true} />);

		expect(getByTestId("ReviewRating")).toHaveTextContent("/5");
		expect(asFragment()).toMatchSnapshot();
	});
});
