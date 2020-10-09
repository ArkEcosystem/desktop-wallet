import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { env, getDefaultProfileId } from "testing-library";

import { evaluateFee, hasSufficientFunds } from "./utils";

let profile: Profile;
let wallet: ReadWriteWallet;
let emptyWallet: ReadWriteWallet;

const blankWalletPassphrase = "power return attend drink piece found tragic fire liar page disease combine";

describe("Transaction utils", () => {
	describe("Evalute Fee", () => {
		it("should return the right fee when object", () => {
			const fee = evaluateFee({ display: "1", value: "100000000" });
			expect(fee.toString()).toEqual("100000000");
		});

		it("should return the right fee when plain", () => {
			const fee = evaluateFee("100000000");
			expect(fee.toString()).toEqual("100000000");
		});
	});

	describe("Check Sufficient Funds", () => {
		beforeAll(async () => {
			profile = env.profiles().findById(getDefaultProfileId());
			emptyWallet = await profile.wallets().importByMnemonic(blankWalletPassphrase, "ARK", "ark.devnet");
			wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");
		});

		it("should have sufficient funds for given fee and amount", () => {
			expect(hasSufficientFunds({ wallet, fee: 1, amount: 1 })).toBe(true);
		});

		it("should have sufficient funds for given fee", () => {
			expect(hasSufficientFunds({ wallet, amount: 1 })).toBe(true);
		});

		it("should have sufficient funds for given amount", () => {
			expect(hasSufficientFunds({ wallet, fee: 1 })).toBe(true);
		});

		it("should not have sufficient funds for given amount and fee", () => {
			expect(hasSufficientFunds({ wallet: wallet, fee: 1000, amount: 1000000000000 })).toBe(false);
		});

		it("should not have sufficient funds for zero balance", () => {
			expect(hasSufficientFunds({ wallet: emptyWallet, fee: 1, amount: 1 })).toBe(false);
		});
	});
});
