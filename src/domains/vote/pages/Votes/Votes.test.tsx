import {   render } from "@testing-library/react";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

import { addressListData, assets, delegateListData } from "../../data";
import { Votes } from "./Votes";

describe("Votes", () => {
	it("should render", () => {
		const { container, asFragment } = render(
			<I18nextProvider i18n={i18n}>
				<Votes assets={assets} addressList={addressListData} delegateList={delegateListData} />
			</I18nextProvider>,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
