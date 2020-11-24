const { SocksProxyAgent } = require("socks-proxy-agent");

module.exports = (api) => {
	api.http().decorate("options", (options) => ({
		...options,
		agent: new SocksProxyAgent("socks5://127.0.0.1:9050"),
	}));
};
