import { act, fireEvent, render } from "@testing-library/react";
import React from "react";

import { Comments } from "./Comments";

describe("Comments", () => {
	const comments = [
		{
			author: "Rok Cernec",
			score: "4.6",
			date: "2020-06-19T14:48:00.000Z",
			comment:
				"As ARK Core is written exclusively in Node.js, the server-side framework for JavaScript and Typescript, installing Node.js is a necessity for core development. The code below installs Node.js from the source.",
		},
		{
			author: "Gerard Blezer",
			score: "4.6",
			date: "2020-06-19T14:48:00.000Z",
			comment:
				"As an open-source platform, the entire ARK codebase is readily available on GitHub providing blockchain developers with a convenient location for all ARK technologies and repositories.",
			replies: [
				{
					date: "2020-06-19T14:48:00.000Z",
					content:
						"<a href='#'>@Gerard Blezer</a> Our GitHub bount reward program utlilizes a tiered structure.",
				},
			],
		},
	];

	const sortOptions = [
		{ label: "Best", value: "best" },
		{ label: "Date", value: "date" },
	];

	it("should render properly", () => {
		const { asFragment } = render(<Comments comments={comments} sortOptions={sortOptions} />);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle sortBy properly", () => {
		const { asFragment, getByText, getByTestId } = render(
			<Comments comments={comments} sortOptions={sortOptions} />,
		);
		const toggle = getByTestId("dropdown__toggle");

		act(() => {
			fireEvent.click(toggle);
		});

		const secondOption = getByTestId("dropdown__option--1");
		expect(secondOption).toBeTruthy();

		act(() => {
			fireEvent.click(secondOption);
		});

		expect(getByText("Date")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
