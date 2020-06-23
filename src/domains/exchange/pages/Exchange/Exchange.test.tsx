import { fireEvent, render } from "@testing-library/react";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

// i18n
import { translations } from "../../i18n";
import { Exchange } from "./Exchange";

describe("Exchange", () => {
	it("should render", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<Exchange exchanges={[]} />
			</I18nextProvider>,
		);

		expect(getByTestId("Exchange")).toHaveTextContent(translations.TITLE);
		expect(getByTestId("Exchange")).toHaveTextContent(translations.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with exchanges", () => {
		const exchanges = [
			{
				id: "changenow-plugin",
				name: "ChangeNOW Plugin",
			},
			{
				id: "binance",
				name: "Binance",
			},
			{
				id: "atomars",
				name: "Atomars",
			},
			{
				id: "okex",
				name: "OKEx",
			},
		];

		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<Exchange exchanges={exchanges} />
			</I18nextProvider>,
		);

		expect(getByTestId("Exchange")).toHaveTextContent(translations.TITLE);
		expect(getByTestId("Exchange")).toHaveTextContent(translations.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should not render filler exchange cards", () => {
		const exchanges = [
			{
				id: "changenow-plugin",
				name: "ChangeNOW Plugin",
			},
			{
				id: "binance",
				name: "Binance",
			},
			{
				id: "atomars",
				name: "Atomars",
			},
		];

		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<Exchange exchanges={exchanges} />
			</I18nextProvider>,
		);

		expect(getByTestId("Exchange")).toHaveTextContent("ChangeNOW Plugin");
		expect(getByTestId("Exchange")).toHaveTextContent("Binance");
		expect(getByTestId("Exchange")).toHaveTextContent("Atomars");
		expect(getByTestId("Exchange")).toHaveTextContent(translations.ADD_EXCHANGE);
		expect(getByTestId("Exchange")).not.toHaveTextContent(translations.EXCHANGE_NAME);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select exchange", () => {
		const exchanges = [
			{
				id: "changenow-plugin",
				name: "ChangeNOW Plugin",
			},
			{
				id: "binance",
				name: "Binance",
			},
			{
				id: "atomars",
				name: "Atomars",
			},
		];

		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<Exchange exchanges={exchanges} />
			</I18nextProvider>,
		);

		const changenowCard = getByTestId("Exchange__exchange-card-changenow-plugin");

		expect(changenowCard).not.toHaveClass("bg-theme-success-100");
		expect(changenowCard).toHaveClass("border-theme-primary-100");

		fireEvent.click(changenowCard);

		expect(changenowCard).toHaveClass("bg-theme-success-100");
		expect(changenowCard).toHaveClass("border-theme-success-300");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should open & close add exchange modal", () => {
		const exchanges = [
			{
				id: "changenow-plugin",
				name: "ChangeNOW Plugin",
			},
			{
				id: "binance",
				name: "Binance",
			},
			{
				id: "atomars",
				name: "Atomars",
			},
		];

		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<Exchange exchanges={exchanges} />
			</I18nextProvider>,
		);

		fireEvent.click(getByTestId("Exchange__add-exchange-card"));

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADD_EXCHANGE.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADD_EXCHANGE.DESCRIPTION);

		fireEvent.click(getByTestId("modal__close-btn"));

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should open & close add exchange modal when no existing exchanges", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<Exchange exchanges={[]} />
			</I18nextProvider>,
		);

		fireEvent.click(getByTestId("Exchange__add-exchange-card"));

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADD_EXCHANGE.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADD_EXCHANGE.DESCRIPTION);

		fireEvent.click(getByTestId("modal__close-btn"));

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		expect(asFragment()).toMatchSnapshot();
	});
});
