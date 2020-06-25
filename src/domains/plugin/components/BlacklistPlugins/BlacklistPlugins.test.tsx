import { render } from "@testing-library/react";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

import { translations } from "../../i18n";
import { BlacklistPlugins } from "./BlacklistPlugins";

describe("BlacklistPlugins", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<BlacklistPlugins isOpen={false} />
			</I18nextProvider>,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<BlacklistPlugins isOpen={true} />
			</I18nextProvider>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_BLACKLIST_PLUGINS.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_BLACKLIST_PLUGINS.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});
});
