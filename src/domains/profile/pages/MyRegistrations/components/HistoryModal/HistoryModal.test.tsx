import React from "react";
import { renderWithRouter } from "testing-library";

import { HistoryModal } from "./HistoryModal";

const history = [
	{
		type: "REGISTRATION",
		date: "27 May 2020",
		transaction: "https://www.google.com.br",
	},
	{
		type: "UPDATE",
		date: "18 May 2020",
		transaction: "https://www.google.com.br",
	},
	{
		type: "UPDATE",
		date: "3 May 2020",
		transaction: "https://www.google.com.br",
	},
	{
		type: "RESIGN",
		date: "15 Jun 2020",
		transaction: "https://www.google.com.br",
	},
];

describe("HistoryModal", () => {
	it("should render empty state", () => {
		const handleClose = jest.fn();

		const { asFragment } = renderWithRouter(<HistoryModal isOpen handleClose={() => handleClose()} />);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render properly", () => {
		const handleClose = jest.fn();

		const { asFragment } = renderWithRouter(
			<HistoryModal history={history} isOpen handleClose={() => handleClose()} />,
		);

		expect(asFragment()).toMatchSnapshot();
	});
});
