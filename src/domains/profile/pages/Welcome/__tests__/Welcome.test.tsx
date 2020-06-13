import React from "react";
import { render } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";

import { i18n } from "app/i18n";

import { Welcome } from "../";

describe("Welcome", () => {
	it("should render", () => {
		const profiles = [
			{
				id: 1,
				name: "Oleg Gelo",
				balance: "234,500.46 USD",
				avatar: "https://www.w3schools.com/howto/img_avatar.png",
			},
		];

		const { container, asFragment } = render(
			<I18nextProvider i18n={i18n}>
				<Welcome profiles={profiles} />
			</I18nextProvider>,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
