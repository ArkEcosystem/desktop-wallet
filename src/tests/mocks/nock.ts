import nock from "nock";

import configurationDevnet from "../fixtures/coins/ark/configuration-devnet.json";
import configuration from "../fixtures/coins/ark/configuration.json";
import cryptoConfiguration from "../fixtures/coins/ark/cryptoConfiguration.json";
import delegates from "../fixtures/coins/ark/delegates.json";
import peers from "../fixtures/coins/ark/peers.json";
import syncing from "../fixtures/coins/ark/syncing.json";
import transactions from "../fixtures/coins/ark/transactions.json";
import votes from "../fixtures/coins/ark/votes.json";
import wallet from "../fixtures/coins/ark/wallet.json";

export const mockArkHttp = () => {
	nock.disableNetConnect();

	nock(/https:\/\/.+.ark.io/)
		.get("/api/node/configuration")
		.reply(200, configuration)
		.get("/api/peers")
		.reply(200, peers)
		.get("/api/node/configuration/crypto")
		.reply(200, cryptoConfiguration)
		.get("/api/node/syncing")
		.reply(200, syncing)
		.get(/\/api\/delegates\/.+/)
		.reply(200, wallet)
		.get(/\/api\/wallets\/.+\/votes/)
		.reply(200, votes)
		.get(/\/api\/wallets\/.+/)
		.reply(200, wallet)
		.get("/api/delegates")
		.reply(200, delegates)
		.post("/api/transactions/search")
		.reply(200, transactions)
		.persist();

	nock("https://neoscan.io")
		.get(/\/api\/main_net\/v1\/get_last_transactions_by_address\/.+/)
		.reply(200, [])
		.persist();
};

export const mockArkDevnetHttp = () => {
	nock.disableNetConnect();

	nock("https://dwallets.ark.io")
		.get("/api/node/configuration")
		.reply(200, configurationDevnet)
		.get("/api/peers")
		.reply(200, peers)
		.get("/api/node/configuration/crypto")
		.reply(200, cryptoConfiguration)
		.get("/api/node/syncing")
		.reply(200, syncing)
		.get(/\/api\/delegates\/.+/)
		.reply(200, wallet)
		.get(/\/api\/wallets\/.+\/votes/)
		.reply(200, votes)
		.get(/\/api\/wallets\/.+/)
		.reply(200, wallet)
		.get("/api/delegates")
		.reply(200, delegates)
		.post("/api/transactions/search")
		.reply(200, transactions)
		.persist();
};
