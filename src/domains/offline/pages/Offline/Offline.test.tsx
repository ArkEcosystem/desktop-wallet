import { render } from "@testing-library/react";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

import { translations } from "../../i18n";
import { Offline } from "./Offline";

describe("Offline", () => {
	it("should render", () => {
		const { container, asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<Offline />
			</I18nextProvider>,
		);

		expect(container).toBeTruthy();
		expect(getByTestId("Offline")).toHaveTextContent(translations.TITLE);
		expect(getByTestId("Offline")).toHaveTextContent(translations.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});
});
