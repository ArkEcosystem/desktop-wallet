import { render } from "@testing-library/react";
import React from "react";

import { DelegateTable } from "./DelegateTable";

describe("Welcome", () => {
	const registrations = [
		{
			agent: "OLEBank",
			delegate: "ARK Ecosystem",
			history: [],
			website: "",
			msq: true,
			repository: [],
		},
		{
			agent: "OLEBank",
			delegate: "ARK Ecosystem",
			history: [],
			website: "",
			msq: true,
			repository: [],
		},
	];

	it("should render empty state", () => {
		const { getAllByTestId, asFragment } = render(<DelegateTable data={registrations} />);

		expect(asFragment()).toMatchSnapshot();
		expect(getAllByTestId("delegate-table__row").length).toEqual(2);
	});
});
