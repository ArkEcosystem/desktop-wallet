import React from "react";
import { IntlProvider } from "react-intl";
import { render } from "@testing-library/react";

import { ImportWallet } from "../ImportWallet";
import translations from "../../../../../i18n/locales";

describe("ImportWallet", () => {
	it("should render", () => {
		const networks = [
			{
				id: 1,
				name: "ARK Ecosystem",
				icon: "ark",
			},
			{
				id: 2,
				name: "Ethereum",
				icon: "eth",
			},
			{
				id: 3,
				name: "Bitcoin",
				icon: "btc",
			},
		];

		const { container, asFragment, getByText } = render(
			<IntlProvider locale="en-US" messages={translations["en-US"].messages}>
				<ImportWallet networks={networks} />
			</IntlProvider>,
		);

		expect(container).toBeTruthy();
		expect(getByText(networks[0].name)).toBeTruthy();
		expect(getByText(networks[1].name)).toBeTruthy();
		expect(getByText(networks[2].name)).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
