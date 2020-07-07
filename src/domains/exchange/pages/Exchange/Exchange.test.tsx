import React from "react";
import { fireEvent, render } from "testing-library";

// i18n
import { translations } from "../../i18n";
import { Exchange } from "./Exchange";

describe("Exchange", () => {
	it("should render", () => {
		const { asFragment, getByTestId } = render(<Exchange exchanges={[]} />);

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

		const { asFragment, getByTestId } = render(<Exchange exchanges={exchanges} />);

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

		const { asFragment, getByTestId } = render(<Exchange exchanges={exchanges} />);

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

		const { asFragment, getByTestId } = render(<Exchange exchanges={exchanges} />);

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

		const { asFragment, getByTestId } = render(<Exchange exchanges={exchanges} />);

		fireEvent.click(getByTestId("Exchange__add-exchange-card"));

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADD_EXCHANGE.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADD_EXCHANGE.DESCRIPTION);

		fireEvent.click(getByTestId("modal__close-btn"));

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should open & close add exchange modal when no existing exchanges", () => {
		const { asFragment, getByTestId } = render(<Exchange exchanges={[]} />);

		fireEvent.click(getByTestId("Exchange__add-exchange-card"));

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADD_EXCHANGE.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADD_EXCHANGE.DESCRIPTION);

		fireEvent.click(getByTestId("modal__close-btn"));

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		expect(asFragment()).toMatchSnapshot();
	});
});
