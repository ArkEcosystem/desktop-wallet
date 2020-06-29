import { render } from "@testing-library/react";
import React from "react";

import { BlockchainTable } from "./BlockchainTable";

describe("Welcome", () => {
	const registrations = [
		{
			agent: "OLEBank",
			businessName: "ARK Ecosystem",
			history: [],
			website: "",
			msq: true,
			repository: [],
		},
		{
			agent: "OLEBank",
			businessName: "ARK Ecosystem",
			history: [],
			website: "",
			msq: true,
			repository: [],
		},
	];

	it("should render empty state", () => {
		const { getAllByTestId, asFragment } = render(<BlockchainTable data={registrations} />);

		expect(asFragment()).toMatchSnapshot();
		expect(getAllByTestId("blockchain-table__row").length).toEqual(2);
	});
});
