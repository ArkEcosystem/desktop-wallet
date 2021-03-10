import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
// @ts-ignore
import { createTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import { render } from "@testing-library/react";
import { ConfigurationProvider, EnvironmentProvider } from "app/contexts";
import { useProfileSynchronizer } from "app/hooks/use-profile-synchronizer";
import { i18n } from "app/i18n";
import { httpClient } from "app/services";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { Router } from "react-router-dom";
import delegate from "tests/fixtures/coins/ark/devnet/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib.json";
import fixtureData from "tests/fixtures/env/storage.json";
import { StubStorage } from "tests/mocks";

const ProfileSynchronizer = ({ children }: { children?: React.ReactNode }) => {
	const { profile, profileIsSyncing } = useProfileSynchronizer();

	if (!profile?.id()) {
		return <>{children}</>;
	}

	if (profileIsSyncing) {
		return <></>;
	}

	return <>{children}</>;
};

export const WithProviders: React.FC = ({ children }: { children?: React.ReactNode }) => (
	<I18nextProvider i18n={i18n}>
		<EnvironmentProvider env={env}>
			<ConfigurationProvider>{children}</ConfigurationProvider>
		</EnvironmentProvider>
	</I18nextProvider>
);

const customRender = (component: React.ReactElement, options: any = {}) =>
	render(component, { wrapper: WithProviders, ...options });

const renderWithRouter = (
	component: React.ReactElement,
	{
		routes = ["/"],
		history = createMemoryHistory({ initialEntries: routes }),
		withProviders = true,
		withProfileSynchronizer = false,
	} = {},
) => {
	const ProfileSynchronizerWrapper = ({ children }: { children: React.ReactNode }) =>
		withProfileSynchronizer ? <ProfileSynchronizer>{children}</ProfileSynchronizer> : <>{children}</>;

	const RouterWrapper = ({ children }: { children: React.ReactNode }) =>
		withProviders ? (
			<WithProviders>
				<Router history={history}>
					<ProfileSynchronizerWrapper>{children}</ProfileSynchronizerWrapper>
				</Router>
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
export const getDefaultWalletMnemonic = () => "master dizzy era math peanut crew run manage better flame tree prevent";
export const getDefaultLedgerTransport = () => createTransportReplayer(RecordStore.fromString(""));

const pluginNames: string[] = ["@dated/transaction-export-plugin", "@dated/delegate-calculator-plugin"];

export const defaultNetMocks = () => {
	nock.disableNetConnect();

	// devnet
	nock("https://dwallets.ark.io")
		.get("/api/blockchain")
		.reply(200, require("../tests/fixtures/coins/ark/devnet/blockchain.json"))
		.get("/api/node/configuration")
		.reply(200, require("../tests/fixtures/coins/ark/devnet/configuration.json"))
		.get("/api/peers")
		.reply(200, require("../tests/fixtures/coins/ark/devnet/peers.json"))
		.get("/api/node/configuration/crypto")
		.reply(200, require("../tests/fixtures/coins/ark/devnet/cryptoConfiguration.json"))
		.get("/api/node/syncing")
		.reply(200, require("../tests/fixtures/coins/ark/devnet/syncing.json"))
		.get("/api/wallets/D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb")
		.reply(200, require("../tests/fixtures/coins/ark/devnet/wallets/D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb.json"))
		.get("/api/wallets/DJXg9Vqg2tofRNrMAvMzhZTkegu8QyyNQq")
		.reply(200, require("../tests/fixtures/coins/ark/devnet/wallets/DJXg9Vqg2tofRNrMAvMzhZTkegu8QyyNQq.json"))
		.get("/api/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib")
		.reply(200, delegate)
		.get("/api/wallets/034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192")
		.reply(200, delegate)
		.get("/api/wallets/D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD")
		.reply(200, require("../tests/fixtures/coins/ark/devnet/wallets/D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD.json"))
		.get("/api/wallets/D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD/votes")
		.reply(200, require("../tests/fixtures/coins/ark/devnet/votes.json"))
		.get("/api/delegates")
		.query(true)
		.reply(200, require("../tests/fixtures/coins/ark/devnet/delegates.json"))
		.get(/\/api\/delegates\/.+/)
		.reply(200, delegate)
		.get("/api/node/fees")
		.query(true)
		.reply(200, require("../tests/fixtures/coins/ark/devnet/node-fees.json"))
		.get("/api/transactions/fees")
		.reply(200, require("../tests/fixtures/coins/ark/devnet/transaction-fees.json"))
		.persist();

	// mainnet
	nock("https://wallets.ark.io")
		.get("/api/node/configuration")
		.reply(200, require("../tests/fixtures/coins/ark/mainnet/configuration.json"))
		.get("/api/peers")
		.reply(200, require("../tests/fixtures/coins/ark/mainnet/peers.json"))
		.get("/api/node/configuration/crypto")
		.reply(200, require("../tests/fixtures/coins/ark/mainnet/cryptoConfiguration.json"))
		.get("/api/node/syncing")
		.reply(200, require("../tests/fixtures/coins/ark/mainnet/syncing.json"))
		.get("/api/wallets/AdVSe37niA3uFUPgCgMUH2tMsHF4LpLoiX")
		.reply(200, require("../tests/fixtures/coins/ark/mainnet/wallets/AdVSe37niA3uFUPgCgMUH2tMsHF4LpLoiX.json"))
		.persist();

	nock("https://min-api.cryptocompare.com")
		.get("/data/dayAvg?fsym=DARK&tsym=BTC&toTs=1593561600")
		.reply(200, require("tests/fixtures/exchange/cryptocompare.json"))
		.persist();

	nock("https://raw.githubusercontent.com")
		.get("/ArkEcosystem/common/master/desktop-wallet/whitelist.json")
		.reply(200, require("tests/fixtures/plugins/whitelist.json"))
		.persist();

	for (const pluginName of pluginNames) {
		nock("https://registry.npmjs.com")
			.get(`/${pluginName}`)
			.reply(200, require(`tests/fixtures/plugins/registry/${pluginName}.json`))
			.persist();

		nock("https://api.npmjs.org")
			.get(new RegExp(`/downloads/range/.*${pluginName}`))
			.reply(200, require(`tests/fixtures/plugins/downloads/${pluginName}`))
			.persist();
	}

	nock("https://raw.githubusercontent.com/dated/transaction-export-plugin/master")
		.get("/logo.png")
		.reply(404)
		.persist();
};

export const useDefaultNetMocks = defaultNetMocks;

const envWithMocks = () => {
	defaultNetMocks();
	return new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
};

export const env = envWithMocks();

export const syncDelegates = async () => await env.delegates().syncAll();

export const syncFees = async () => await env.fees().syncAll();
