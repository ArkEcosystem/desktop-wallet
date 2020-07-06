import { render, screen, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { Router } from "react-router-dom";

import { App } from "./App";

beforeAll(() => {
	nock.disableNetConnect();
});

beforeEach(() => {
	const responseBody = JSON.stringify({
		data: {
			exceptions: {},
			genesisBlock: {},
			milestones: {},
			network: {},
		},
	});

	nock("http://167.114.29.54:4003/api").get("/node/configuration/crypto").reply(200, responseBody);
});

describe("App", () => {
	const history = createMemoryHistory();

	it("should render", async () => {
		const { container, asFragment } = render(
			<Router history={history}>
				<App />
			</Router>,
		);

		await waitFor(async () => {
			await expect(
				screen.findByText("Create a new Profile or login with your MarketSquare account to get started"),
			).resolves.toBeInTheDocument();
		});

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render mock", () => {
		process.env.REACT_APP_BUILD_MODE = "demo";

		const { container } = render(
			<Router history={history}>
				<App />
			</Router>,
		);
		expect(container).toBeTruthy();
	});

	it("should render tailwind debug", () => {
		process.env.NODE_ENV = "development";
		process.env.REACT_APP_BUILD_MODE = "demo";

		const { container } = render(
			<Router history={history}>
				<App />
			</Router>,
		);
		expect(container).toBeTruthy();
	});
});
