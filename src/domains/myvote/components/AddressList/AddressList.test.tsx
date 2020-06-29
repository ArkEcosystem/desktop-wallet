import { render } from "@testing-library/react";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

import { addressListData } from "../../data";
import { AddressList } from "./AddressList";

describe("AddressList", () => {
	it("should render", () => {
		const { container, asFragment } = render(
			<I18nextProvider i18n={i18n}>
				<AddressList data={addressListData} />
			</I18nextProvider>,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with empty list", () => {
		const { container, asFragment } = render(
			<I18nextProvider i18n={i18n}>
				<AddressList data={[]} />
			</I18nextProvider>,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
