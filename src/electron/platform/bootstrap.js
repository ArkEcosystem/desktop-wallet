const { ARK } = require("@arkecosystem/platform-sdk-ark");
const { Environment } = require("@arkecosystem/platform-sdk-profiles");
const { Request } = require("@arkecosystem/platform-sdk-http-got");

module.exports = {
	env: new Environment({
		coins: { ARK },
		httpClient: new Request(),
		storage: "memory",
	}),
};
