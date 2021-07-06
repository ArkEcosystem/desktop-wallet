import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { env, MNEMONICS } from "utils/testing-library";

import { getDefaultAlias } from "./get-default-alias";

describe("getDefaultAlias", () => {
	let profile: Contracts.IProfile;

	beforeEach(async () => {
		profile = env.profiles().create("empty profile");

		await env.profiles().restore(profile);
	});

	afterEach(() => {
		env.profiles().forget(profile.id());
	});

	it("should return a default alias when wallet already exists", async () => {
		const wallet = await profile.walletFactory().fromMnemonicWithBIP39({
			coin: "ARK",
			mnemonic: MNEMONICS[0],
			network: "ark.devnet",
		});

		profile.wallets().push(wallet);

		const result = getDefaultAlias({
			profile,
			ticker: wallet.network().ticker(),
		});

		expect(result).toBe("DARK #1");
	});

	it("should return a default alias when wallet does not exist yet", () => {
		const result = getDefaultAlias({ profile, ticker: "BTC" });

		expect(result).toBe("BTC #1");
	});

	it("should not return alias that already exist", async () => {
		const wallet = await profile.walletFactory().fromMnemonicWithBIP39({
			coin: "ARK",
			mnemonic: MNEMONICS[0],
			network: "ark.devnet",
		});

		profile.wallets().push(wallet);

		profile.wallets().update(wallet.id(), { alias: "DARK #1" });

		const result = getDefaultAlias({
			profile,
			ticker: wallet.network().ticker(),
		});

		expect(result).toBe("DARK #2");
	});
});
