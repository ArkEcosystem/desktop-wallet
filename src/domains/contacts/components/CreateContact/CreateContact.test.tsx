import { render } from "@testing-library/react";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

import { translations } from "../../i18n";
import { CreateContact } from "./CreateContact";

describe("CreateContact", () => {
	const onSave = jest.fn();

	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<CreateContact isOpen={false} onSave={onSave} />
			</I18nextProvider>,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const networks = [
			{
				label: "Ark Ecosystem",
				value: "ark",
				icon: "Ark",
			},
			{
				label: "Bitcoin",
				value: "btc",
				icon: "Btc",
			},
			{
				label: "Ethereum",
				value: "eth",
				icon: "Eth",
			},
		];

		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<CreateContact isOpen={true} networks={networks} onSave={onSave} />
			</I18nextProvider>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CREATE_CONTACT.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CREATE_CONTACT.DESCRIPTION);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CREATE_CONTACT.FORM.NAME);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CREATE_CONTACT.FORM.NETWORK);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_CREATE_CONTACT.FORM.ADDRESS);
		expect(asFragment()).toMatchSnapshot();
	});
});
