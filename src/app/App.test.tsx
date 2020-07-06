import { render, screen, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { Router } from "react-router-dom";

import { App } from "./App";

beforeAll(() => {
	nock.disableNetConnect();
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
});
