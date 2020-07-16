import React from "react";
import { render } from "testing-library";

import { StarsCounters } from "./StarsCounters";

const ratings = [
	{
		rating: 5,
		votes: 156,
	},
	{
		rating: 4,
		votes: 194,
	},
	{
		rating: 3,
		votes: 25,
	},
	{
		rating: 2,
		votes: 42,
	},
	{
		rating: 1,
		votes: 7,
	},
];

describe("StarsCounters", () => {
	it("should render properly", () => {
		const { asFragment, getByTestId } = render(<StarsCounters ratings={ratings} totalAvaliations={347} />);

		expect(getByTestId("5-stars__rating-count")).toBeTruthy();
		expect(getByTestId("4-stars__rating-count")).toBeTruthy();
		expect(getByTestId("3-stars__rating-count")).toBeTruthy();
		expect(getByTestId("2-stars__rating-count")).toBeTruthy();
		expect(getByTestId("1-stars__rating-count")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
