import { createMemoryHistory } from "history";
import React from "react";
import { Router } from "react-router-dom";
import { render, screen, waitFor } from "test-utils";

import App from "./";

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
});
