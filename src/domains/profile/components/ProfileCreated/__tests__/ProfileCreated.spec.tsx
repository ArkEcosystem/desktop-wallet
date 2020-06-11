import React from "react";
import { render } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";

import { i18n } from "app/i18n";

import { ProfileCreated } from "../";

import { translations } from "../../../i18n";

describe("ProfileCreated", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<ProfileCreated isOpen={false} onStart={() => void 0} />
			</I18nextProvider>,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<ProfileCreated isOpen={true} onStart={() => void 0} />
			</I18nextProvider>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_PROFILE_CREATED.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_PROFILE_CREATED.DESCRIPTION_1);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_PROFILE_CREATED.DESCRIPTION_2);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_PROFILE_CREATED.START_TUTORIAL);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_PROFILE_CREATED.SKIP_TUTORIAL);
		expect(asFragment()).toMatchSnapshot();
	});
});
