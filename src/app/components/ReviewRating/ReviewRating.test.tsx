import { render } from "@testing-library/react";
import React from "react";

import { ReviewRating } from "./ReviewRating";

describe("ReviewRating", () => {
	it("should render", () => {
		const { asFragment } = render(<ReviewRating rating={1.5} />);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with total", () => {
		const { asFragment, getByTestId } = render(<ReviewRating rating={1.5} showTotal={true} />);

		expect(getByTestId("ReviewRating")).toHaveTextContent("1.5/5");
		expect(asFragment()).toMatchSnapshot();
	});
});
