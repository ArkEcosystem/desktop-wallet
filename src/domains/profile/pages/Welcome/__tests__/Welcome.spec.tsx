import React from "react";
import { IntlProvider } from "react-intl";
import { render } from "@testing-library/react";

import { Welcome } from "../";
import translations from "../../../../../i18n/locales";

describe("Welcome", () => {
	it("should render", () => {
		const welcomeText = translations["en-US"].messages["COMMON_WELCOME"];
		const profiles = [
			{
				id: 1,
				name: "Oleg Gelo",
				balance: "234,500.46 USD",
				avatar: "https://www.w3schools.com/howto/img_avatar.png",
			},
		];
		const { container, asFragment, getByText } = render(
			<IntlProvider locale="en-US" messages={translations["en-US"].messages}>
				<Welcome profiles={profiles} />
			</IntlProvider>,
		);

		expect(container).toBeTruthy();
		expect(getByText(welcomeText)).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
