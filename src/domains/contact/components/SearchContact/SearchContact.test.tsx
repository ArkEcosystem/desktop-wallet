import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment, Profile } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";
import nock from "nock";
import React from "react";
import { render } from "testing-library";
import fixtureData from "tests/fixtures/env/storage.json";
import { StubStorage } from "tests/mocks";

import { translations } from "../../i18n";
import { SearchContact } from "./SearchContact";

let profile: Profile;

describe("SearchContact", () => {
	beforeAll(async () => {
		nock.disableNetConnect();

		nock("https://dwallets.ark.io")
			.get("/api/node/configuration")
			.reply(200, require("../../../../tests/fixtures/coins/ark/configuration-devnet.json"))
			.get("/api/peers")
			.reply(200, require("../../../../tests/fixtures/coins/ark/peers.json"))
			.get("/api/node/configuration/crypto")
			.reply(200, require("../../../../tests/fixtures/coins/ark/cryptoConfiguration.json"))
			.get("/api/node/syncing")
			.reply(200, require("../../../../tests/fixtures/coins/ark/syncing.json"))
			.get("/api/wallets/D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD")
			.reply(200, require("../../../../tests/fixtures/coins/ark/wallets/D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD.json"))
			.get("/api/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib")
			.reply(200, require("../../../../tests/fixtures/coins/ark/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib.json"))
			.persist();

		const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
		await env.bootFromObject(fixtureData);

		profile = env.profiles().findById("b999d134-7a24-481e-a95d-bc47c543bfc9");
	});

	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<SearchContact isOpen={false} profile={profile} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(<SearchContact isOpen={true} profile={profile} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SEARCH_CONTACT.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_SEARCH_CONTACT.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal with custom title and description", () => {
		const title = "Modal title";
		const description = "Modal description";
		const { asFragment, getByTestId } = render(
			<SearchContact isOpen={true} profile={profile} title={title} description={description} />,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent("Modal title");
		expect(getByTestId("modal__inner")).toHaveTextContent("Modal description");
		expect(asFragment()).toMatchSnapshot();
	});
});
