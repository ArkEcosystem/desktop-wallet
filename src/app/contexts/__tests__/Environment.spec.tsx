import { render, screen, waitFor } from "@testing-library/react";
import React from "react";

import { EnvironmentProvider } from "../";

describe("Environment Context", () => {
	it("should render the wrapper properly", async () => {
		const { container, asFragment } = render(
			<EnvironmentProvider>
				<span>Provider testing</span>
			</EnvironmentProvider>,
		);

		await waitFor(async () => {
			expect(await screen.findByText("Provider testing")).toBeInTheDocument();
		});

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
