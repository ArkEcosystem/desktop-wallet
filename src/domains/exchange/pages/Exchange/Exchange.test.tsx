import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { env, fireEvent, getDefaultProfileId, renderWithRouter, useDefaultNetMocks } from "testing-library";
import fixtureData from "tests/fixtures/env/storage.json";

import { translations } from "../../i18n";
import { Exchange } from "./Exchange";

const history = createMemoryHistory();

const exchangeURL = `/profiles/${getDefaultProfileId()}/exchange`;

describe("Exchange", () => {
	beforeAll(useDefaultNetMocks);

	beforeAll(async () => {
		await env.bootFromObject(fixtureData);
		await env.persist();
		history.push(exchangeURL);
	});

	it("should render", () => {
		const { container, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/exchange">
				<Exchange exchanges={[]} />
			</Route>,
			{
				routes: [exchangeURL],
				history,
			},
		);

		expect(getByTestId("header__title")).toHaveTextContent(translations.TITLE);
		expect(getByTestId("header__subtitle")).toHaveTextContent(translations.DESCRIPTION);
		expect(container).toMatchSnapshot();
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

		const { container, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/exchange">
				<Exchange exchanges={exchanges} />
			</Route>,
			{
				routes: [exchangeURL],
				history,
			},
		);

		expect(getByTestId("header__title")).toHaveTextContent(translations.TITLE);
		expect(getByTestId("header__subtitle")).toHaveTextContent(translations.DESCRIPTION);
		expect(container).toMatchSnapshot();
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

		const { container, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/exchange">
				<Exchange exchanges={exchanges} />
			</Route>,
			{
				routes: [exchangeURL],
				history,
			},
		);

		expect(getByText("ChangeNOW Plugin")).toBeTruthy();
		expect(getByText("Binance")).toBeTruthy();
		expect(getByText("Atomars")).toBeTruthy();
		expect(getByText(translations.ADD_EXCHANGE)).toBeTruthy();
		expect(() => getByText(translations.EXCHANGE_NAME)).toThrow(/Unable to find an element/);
		expect(container).toMatchSnapshot();
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

		const { container, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/exchange">
				<Exchange exchanges={exchanges} />
			</Route>,
			{
				routes: [exchangeURL],
				history,
			},
		);

		const changenowCard = getByTestId("Exchange__exchange-card-changenow-plugin");

		expect(changenowCard).not.toHaveClass("bg-theme-success-contrast");
		expect(changenowCard).toHaveClass("border-theme-primary-contrast");

		fireEvent.click(changenowCard);

		expect(changenowCard).toHaveClass("bg-theme-success-contrast");
		expect(changenowCard).toHaveClass("border-theme-success-300");
		expect(container).toMatchSnapshot();
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

		const { container, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/exchange">
				<Exchange exchanges={exchanges} />
			</Route>,
			{
				routes: [exchangeURL],
				history,
			},
		);

		fireEvent.click(getByTestId("Exchange__add-exchange-card"));

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADD_EXCHANGE.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADD_EXCHANGE.DESCRIPTION);

		fireEvent.click(getByTestId("modal__close-btn"));

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		expect(container).toMatchSnapshot();
	});

	it("should open & close add exchange modal when no existing exchanges", () => {
		const { container, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/exchange">
				<Exchange exchanges={[]} />
			</Route>,
			{
				routes: [exchangeURL],
				history,
			},
		);

		fireEvent.click(getByTestId("Exchange__add-exchange-card"));

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADD_EXCHANGE.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADD_EXCHANGE.DESCRIPTION);

		fireEvent.click(getByTestId("modal__close-btn"));

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		expect(container).toMatchSnapshot();
	});
});
