import { render } from "@testing-library/react";
import React from "react";

import { PluginDetails } from "./PluginDetails";

describe("PluginDetails", () => {
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
		{
			author: "Rok Cernec",
			score: "4.6",
			date: "2020-06-19T14:48:00.000Z",
			comment:
				"As ARK Core is written exclusively in Node.js, the server-side framework for JavaScript and Typescript, installing Node.js is a necessity for core development. The code below installs Node.js from the source.",
		},
		{
			author: "Rok Cernec",
			score: "4.6",
			date: "2020-06-19T14:48:00.000Z",
			comment:
				"As ARK Core is written exclusively in Node.js, the server-side framework for JavaScript and Typescript, installing Node.js is a necessity for core development. The code below installs Node.js from the source.",
		},
	];

	const pluginData = {
		author: "ARK Ecosystem",
		about:
			"Use the ARK Explorer to get full visibility of critical data from the ARK network. Data such as the latest blocks, wallet addresses and transactions. Plus monitor delegate status, their position and more.",
		permissions: ["Embedded Webpages", "API Requests", "Access to Profiles"],
		screenshots: [1, 2, 3],
		category: "Utility",
		url: "github.com",
		averageRating: "4.6",
		version: "1.3.8",
		size: "4.2",
	};

	const reviewData = {
		comments,
		ratings,
		totalAvaliations: 347,
	};

	it("should render properly", () => {
		const { asFragment, getByTestId } = render(<PluginDetails pluginData={pluginData} reviewData={reviewData} />);

		expect(getByTestId("plugin-details__header")).toBeTruthy();
		expect(getByTestId("plugin-details__comments")).toBeTruthy();
		expect(getByTestId("plugin-details__review-box")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render properly as installed", () => {
		const { asFragment, getByTestId } = render(
			<PluginDetails pluginData={pluginData} reviewData={reviewData} isInstalled />,
		);

		expect(getByTestId("plugin-details__header")).toBeTruthy();
		expect(getByTestId("plugin-details__comments")).toBeTruthy();
		expect(getByTestId("plugin-details__review-box")).toBeTruthy();
		expect(getByTestId("PluginHeader__button--uninstall")).toBeTruthy();
		expect(getByTestId("PluginHeader__button--open")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});
});
