import React from "react";
import { renderWithRouter, screen, waitFor } from "testing-library";

import { App } from "./";

describe("App", () => {
	it("should render", async () => {
		const { container, asFragment } = renderWithRouter(<App />);

		await waitFor(async () => {
			await expect(
				screen.findByText("Create a new Profile or login with your MarketSquare account to get started"),
			).resolves.toBeInTheDocument();
		});

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
