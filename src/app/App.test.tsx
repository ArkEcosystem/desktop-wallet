import nock from "nock";
import React from "react";
import { renderWithRouter } from "utils/testing-library";

import { translations as profileTranslations } from "../domains/profile/i18n";
import { App } from "./App";

beforeAll(() => {
	nock.disableNetConnect();

	nock("https://dwallets.ark.io")
		.get("/api/node/configuration")
		.reply(200, require("../tests/fixtures/coins/ark/configuration-devnet.json"))
		.get("/api/peers")
		.reply(200, require("../tests/fixtures/coins/ark/peers.json"))
		.get("/api/node/configuration/crypto")
		.reply(200, require("../tests/fixtures/coins/ark/cryptoConfiguration.json"))
		.get("/api/node/syncing")
		.reply(200, require("../tests/fixtures/coins/ark/syncing.json"))
		.get("/api/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib")
		.reply(200, require("../tests/fixtures/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib.json"))
		.persist();
});

describe("App", () => {
	it("should render", () => {
		const { container, asFragment, getByText } = renderWithRouter(<App />);

		expect(getByText(profileTranslations.PAGE_CREATE_PROFILE.DESCRIPTION)).toBeInTheDocument();

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render mock", () => {
		process.env.REACT_APP_BUILD_MODE = "demo";

		const { container } = renderWithRouter(<App />);
		expect(container).toBeTruthy();
	});
});
