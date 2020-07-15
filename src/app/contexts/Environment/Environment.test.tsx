import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";
import React from "react";
import { render, screen, waitFor } from "testing-library";
import { StubStorage } from "tests/mocks";

import { EnvironmentProvider } from "./Environment";

describe("Environment Context", () => {
	it("should render the wrapper properly", async () => {
		const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });

		const { container, asFragment } = render(
			<EnvironmentProvider env={env}>
				<span>Provider testing</span>
			</EnvironmentProvider>,
		);

		await waitFor(async () => {
			await expect(screen.findByText("Provider testing")).resolves.toBeInTheDocument();
		});

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
