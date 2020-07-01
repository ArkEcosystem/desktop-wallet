import { render } from "@testing-library/react";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter as Router } from "react-router-dom";

import { HistoryModal } from "./HistoryModal";

describe("HistoryModal", () => {
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

	it("should render empty state", () => {
		const handleClose = jest.fn();

		const { asFragment } = render(
			<Router>
				<I18nextProvider i18n={i18n}>
					<HistoryModal isOpen handleClose={() => handleClose()} />,
				</I18nextProvider>
			</Router>,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render properly", () => {
		const handleClose = jest.fn();

		const { asFragment } = render(
			<Router>
				<I18nextProvider i18n={i18n}>
					<HistoryModal history={history} isOpen handleClose={() => handleClose()} />,
				</I18nextProvider>
			</Router>,
		);

		expect(asFragment()).toMatchSnapshot();
	});
});
