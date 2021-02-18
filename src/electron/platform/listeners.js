const { env } = require("./bootstrap");

process.on("message", async (message) => {
	console.log(`[LISTENER] ${message}`);

	if (message === "boot") {
		await env.verify();
		await env.boot();

		console.log(env.profiles().create("John Doe").toObject());
	}

	process.send("hello");
});
