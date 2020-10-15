import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { render } from "@testing-library/react";
import { EnvironmentProvider, ThemeProvider } from "app/contexts";
import { i18n } from "app/i18n";
import { httpClient } from "app/services";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { Router } from "react-router-dom";
import delegate from "tests/fixtures/coins/ark/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib.json";
import fixtureData from "tests/fixtures/env/storage.json";
import { StubStorage } from "tests/mocks";

const WithProviders: React.FC = ({ children }: { children?: React.ReactNode }) => (
	<I18nextProvider i18n={i18n}>
		<EnvironmentProvider env={env}>
			<ThemeProvider>{children}</ThemeProvider>
		</EnvironmentProvider>
	</I18nextProvider>
);

const customRender = (component: React.ReactElement, options: any = {}) =>
	render(component, { wrapper: WithProviders, ...options });

const renderWithRouter = (
	component: React.ReactElement,
	{ routes = ["/"], history = createMemoryHistory({ initialEntries: routes }), withProviders = true } = {},
) => {
	const RouterWrapper = ({ children }: { children: React.ReactNode }) =>
		withProviders ? (
			<WithProviders>
				<Router history={history}>{children}</Router>
			</WithProviders>
		) : (
			<Router history={history}>{children}</Router>
		);

	return {
		...customRender(component, { wrapper: RouterWrapper }),
		history,
	};
};

export * from "@testing-library/react";

export { customRender as render, renderWithRouter };

export const getDefaultProfileId = () => Object.keys(fixtureData.profiles)[0];
export const getDefaultWalletId = () => Object.keys(Object.values(fixtureData.profiles)[0].wallets)[0];

export const defaultNetMocks = () => {
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
		.get("/api/wallets/D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb")
		.reply(200, require("../tests/fixtures/coins/ark/wallets/D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb.json"))
		.get("/api/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib")
		.reply(200, delegate)
		.get("/api/wallets/034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192")
		.reply(200, delegate)
		.get("/api/wallets/D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD")
		.reply(200, require("../tests/fixtures/coins/ark/wallets/D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD.json"))
		.get("/api/wallets/D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD/votes")
		.reply(200, require("../tests/fixtures/coins/ark/votes.json"))
		.get("/api/delegates")
		.query(true)
		.reply(200, require("../tests/fixtures/coins/ark/delegates-devnet.json"))
		.get(/\/api\/delegates\/.+/)
		.reply(200, delegate)
		.get("/api/node/fees")
		.query(true)
		.reply(200, require("../tests/fixtures/coins/ark/node-fees.json"))
		.get("/api/transactions/fees")
		.reply(200, require("../tests/fixtures/coins/ark/transaction-fees.json"))
		.persist();

	nock("https://min-api.cryptocompare.com")
		.get("/data/dayAvg?fsym=DARK&tsym=BTC&toTs=1593561600")
		.reply(200, require("tests/fixtures/exchange/cryptocompare.json"))
		.persist();
};

export const useDefaultNetMocks = defaultNetMocks;

const envWithMocks = () => {
	defaultNetMocks();
	return new Environment({ coins: { ARK }, httpClient, storage: new StubStorage(fixtureData) });
};

export const env = envWithMocks();

export const syncDelegates = async () => await env.delegates().syncAll();

export const syncFees = async () => await env.fees().syncAll();
