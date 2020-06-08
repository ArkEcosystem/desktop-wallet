import React from "react";
import { IntlProvider } from "react-intl";
import { render } from "@testing-library/react";

import { Welcome } from "../";
// i18n
import { locales } from "i18n/locales";

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
			<IntlProvider locale="en-US" messages={locales["en-US"].messages}>
				<Welcome profiles={profiles} />
			</IntlProvider>,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
