/* eslint-disable unicorn/no-null */

import { Coins, Networks } from "@arkecosystem/platform-sdk";
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { Wallet } from "@arkecosystem/platform-sdk-profiles/distribution/wallet";

import { assertCoin, assertNetwork, assertNumber, assertProfile, assertString, assertWallet } from "./assertions";

describe("#assertProfile", () => {
	it("should pass with a profile instance", () => {
		expect(() =>
			assertProfile(
				new Profile({
					data: "{}",
					id: "id",
					name: "John Doe",
				}),
			),
		).not.toThrow();
	});

	it("should fail without a profile instance", () => {
		expect(() => assertProfile(undefined)).toThrow(
			"Expected 'profile' to be Contracts.IProfile, but received undefined",
		);
		expect(() => assertProfile(null)).toThrow("Expected 'profile' to be Contracts.IProfile, but received null");
		expect(() => assertProfile(true)).toThrow("Expected 'profile' to be Contracts.IProfile, but received true");
		expect(() => assertProfile(false)).toThrow("Expected 'profile' to be Contracts.IProfile, but received false");
		expect(() => assertProfile("")).toThrow("Expected 'profile' to be Contracts.IProfile, but received ");
		expect(() => assertProfile("a")).toThrow("Expected 'profile' to be Contracts.IProfile, but received a");
		expect(() => assertProfile(1)).toThrow("Expected 'profile' to be Contracts.IProfile, but received 1");
		expect(() => assertProfile({})).toThrow(
			"Expected 'profile' to be Contracts.IProfile, but received [object Object]",
		);
		expect(() => assertProfile([])).toThrow("Expected 'profile' to be Contracts.IProfile, but received ");
	});
});

describe("#assertWallet", () => {
	it("should pass with a wallet instance", () => {
		// @ts-ignore
		expect(() => assertWallet(new Wallet())).not.toThrow();
	});

	it("should fail without a profile instance", () => {
		expect(() => assertWallet(undefined)).toThrow(
			"Expected 'wallet' to be Contracts.IReadWriteWallet, but received undefined",
		);
		expect(() => assertWallet(null)).toThrow(
			"Expected 'wallet' to be Contracts.IReadWriteWallet, but received null",
		);
		expect(() => assertWallet(true)).toThrow(
			"Expected 'wallet' to be Contracts.IReadWriteWallet, but received true",
		);
		expect(() => assertWallet(false)).toThrow(
			"Expected 'wallet' to be Contracts.IReadWriteWallet, but received false",
		);
		expect(() => assertWallet("")).toThrow("Expected 'wallet' to be Contracts.IReadWriteWallet, but received ");
		expect(() => assertWallet("a")).toThrow("Expected 'wallet' to be Contracts.IReadWriteWallet, but received a");
		expect(() => assertWallet(1)).toThrow("Expected 'wallet' to be Contracts.IReadWriteWallet, but received 1");
		expect(() => assertWallet({})).toThrow(
			"Expected 'wallet' to be Contracts.IReadWriteWallet, but received [object Object]",
		);
		expect(() => assertWallet([])).toThrow("Expected 'wallet' to be Contracts.IReadWriteWallet, but received ");
	});
});

describe("#assertCoin", () => {
	it("should pass with a coin instance", () => {
		// @ts-ignore
		expect(() => assertCoin(new Coins.Coin())).not.toThrow();
	});

	it("should fail without a coin instance", () => {
		expect(() => assertCoin(undefined)).toThrow("Expected 'coin' to be Coins.Coin, but received undefined");
		expect(() => assertCoin(null)).toThrow("Expected 'coin' to be Coins.Coin, but received null");
		expect(() => assertCoin(true)).toThrow("Expected 'coin' to be Coins.Coin, but received true");
		expect(() => assertCoin(false)).toThrow("Expected 'coin' to be Coins.Coin, but received false");
		expect(() => assertCoin("")).toThrow("Expected 'coin' to be Coins.Coin, but received ");
		expect(() => assertCoin("a")).toThrow("Expected 'coin' to be Coins.Coin, but received a");
		expect(() => assertCoin(1)).toThrow("Expected 'coin' to be Coins.Coin, but received 1");
		expect(() => assertCoin({})).toThrow("Expected 'coin' to be Coins.Coin, but received [object Object]");
		expect(() => assertCoin([])).toThrow("Expected 'coin' to be Coins.Coin, but received ");
	});
});

describe("#assertNetwork", () => {
	it("should pass with a network instance", () => {
		// @ts-ignore
		expect(() => assertNetwork(new Networks.Network())).not.toThrow();
	});

	it("should fail without a network instance", () => {
		expect(() => assertNetwork(undefined)).toThrow(
			"Expected 'network' to be Networks.Network, but received undefined",
		);
		expect(() => assertNetwork(null)).toThrow("Expected 'network' to be Networks.Network, but received null");
		expect(() => assertNetwork(true)).toThrow("Expected 'network' to be Networks.Network, but received true");
		expect(() => assertNetwork(false)).toThrow("Expected 'network' to be Networks.Network, but received false");
		expect(() => assertNetwork("")).toThrow("Expected 'network' to be Networks.Network, but received ");
		expect(() => assertNetwork("a")).toThrow("Expected 'network' to be Networks.Network, but received a");
		expect(() => assertNetwork(1)).toThrow("Expected 'network' to be Networks.Network, but received 1");
		expect(() => assertNetwork({})).toThrow(
			"Expected 'network' to be Networks.Network, but received [object Object]",
		);
		expect(() => assertNetwork([])).toThrow("Expected 'network' to be Networks.Network, but received ");
	});
});

describe("#assertString", () => {
	it("should pass with a string", () => {
		expect(() => assertString("a")).not.toThrow();
		expect(() => assertString(Number(1).toString())).not.toThrow();
	});

	it("should fail without a string", () => {
		expect(() => assertString(undefined)).toThrow("Expected 'value' to be string, but received undefined");
		expect(() => assertString(null)).toThrow("Expected 'value' to be string, but received null");
		expect(() => assertString(true)).toThrow("Expected 'value' to be string, but received true");
		expect(() => assertString(false)).toThrow("Expected 'value' to be string, but received false");
		expect(() => assertString("")).toThrow("Expected 'value' to be string, but received ");
		expect(() => assertString(1)).toThrow("Expected 'value' to be string, but received 1");
		expect(() => assertString({})).toThrow("Expected 'value' to be string, but received [object Object]");
		expect(() => assertString([])).toThrow("Expected 'value' to be string, but received ");
	});
});

describe("#assertNumber", () => {
	it("should pass with a number", () => {
		expect(() => assertNumber(1)).not.toThrow();
		expect(() => assertNumber(3.1)).not.toThrow();
		expect(() => assertNumber(Number(1))).not.toThrow();
		expect(() => assertNumber(Number.MAX_SAFE_INTEGER)).not.toThrow();
	});

	it("should fail without a number", () => {
		expect(() => assertNumber(undefined)).toThrow("Expected 'value' to be number, but received undefined");
		expect(() => assertNumber(null)).toThrow("Expected 'value' to be number, but received null");
		expect(() => assertNumber(true)).toThrow("Expected 'value' to be number, but received true");
		expect(() => assertNumber(false)).toThrow("Expected 'value' to be number, but received false");
		expect(() => assertNumber("")).toThrow("Expected 'value' to be number, but received ");
		expect(() => assertNumber("1")).toThrow("Expected 'value' to be number, but received 1");
		expect(() => assertNumber({})).toThrow("Expected 'value' to be number, but received [object Object]");
		expect(() => assertNumber([])).toThrow("Expected 'value' to be number, but received ");
		expect(() => assertNumber(Number.NaN)).toThrow("Expected 'value' to be number, but received NaN");
		expect(() => assertNumber(Number.MAX_SAFE_INTEGER + 1)).toThrow(
			"Expected 'value' to be number, but received 9007199254740992",
		);
	});
});
