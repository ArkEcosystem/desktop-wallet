import nock from "nock";
import React from "react";
import { renderWithRouter, screen, waitFor } from "testing-library";

import { App } from "./App";

beforeAll(() => {
	nock.disableNetConnect();

	nock(/.+/)
		.get("/api/node/configuration/crypto")
		.reply(200, require("../tests/fixtures/coins/ark/cryptoConfiguration.json"))
		.get("/api/node/syncing")
		.reply(200, require("../tests/fixtures/coins/ark/syncing.json"))
		.get("/api/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib")
		.reply(200, require("../tests/fixtures/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib.json"))
		.persist();
});

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

	it("should render mock", () => {
		process.env.REACT_APP_BUILD_MODE = "demo";

		const { container } = renderWithRouter(<App />);
		expect(container).toBeTruthy();
	});

	it("should render tailwind debug", () => {
		process.env.NODE_ENV = "development";
		process.env.REACT_APP_BUILD_MODE = "demo";

		const { container } = renderWithRouter(<App />);
		expect(container).toBeTruthy();

		process.env.NODE_ENV = "test";
	});
});
