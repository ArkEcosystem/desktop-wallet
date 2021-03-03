import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { fireEvent, getDefaultProfileId, renderWithRouter } from "testing-library";

import { translations } from "../../i18n";
import { Exchange } from "./Exchange";

const history = createMemoryHistory();

const exchangeURL = `/profiles/${getDefaultProfileId()}/exchange`;

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

describe("Exchange", () => {
	beforeAll(() => {
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

	it("should select exchange", () => {
		const { container, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/exchange">
				<Exchange exchanges={exchanges} />
			</Route>,
			{
				routes: [exchangeURL],
				history,
			},
		);

		fireEvent.click(getByText(exchanges[0].name));

		expect(container).toMatchSnapshot();
	});

	it("should render filler exchange cards", () => {
		const { container, getAllByText, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/exchange">
				<Exchange exchanges={[...exchanges, { id: "okex", name: "OKEx" }]} />
			</Route>,
			{
				routes: [exchangeURL],
				history,
			},
		);

		expect(getByText("ChangeNOW Plugin")).toBeTruthy();
		expect(getByText("Binance")).toBeTruthy();
		expect(getByText("Atomars")).toBeTruthy();
		expect(getByText("OKEx")).toBeTruthy();
		expect(getByText(translations.ADD_EXCHANGE)).toBeTruthy();
		expect(getAllByText(translations.EXCHANGE_NAME).length).toBe(3);
		expect(container).toMatchSnapshot();
	});

	it("should not render filler exchange cards", () => {
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

	it("should open & close add exchange modal", async () => {
		const { container, findByText, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/exchange">
				<Exchange exchanges={exchanges} />
			</Route>,
			{
				routes: [exchangeURL],
				history,
			},
		);

		fireEvent.click(await findByText(translations.ADD_EXCHANGE));

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADD_EXCHANGE.TITLE);

		fireEvent.click(getByTestId("modal__close-btn"));

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		expect(container).toMatchSnapshot();
	});

	it("should open & close add exchange modal when no existing exchanges", async () => {
		const { container, findByText, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/exchange">
				<Exchange exchanges={[]} />
			</Route>,
			{
				routes: [exchangeURL],
				history,
			},
		);

		fireEvent.click(await findByText(translations.ADD_EXCHANGE));

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADD_EXCHANGE.TITLE);

		fireEvent.click(getByTestId("modal__close-btn"));

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		expect(container).toMatchSnapshot();
	});
});
