/* eslint-disable @typescript-eslint/require-await */
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { renderHook } from "@testing-library/react-hooks";
import { EnvironmentProvider } from "app/contexts";
import nock from "nock";
import React from "react";
import { env, getDefaultProfileId, syncDelegates } from "utils/testing-library";

import { useWalletDisplay } from "./";

let profile: Profile;
let wallets: ReadWriteWallet[];

describe("useWalletDisplay hook", () => {
	beforeAll(async () => {
		nock("https://neoscan.io/api/main_net/v1/")
			.get("/get_last_transactions_by_address/AdVSe37niA3uFUPgCgMUH2tMsHF4LpLoiX/1")
			.reply(200, []);

		profile = env.profiles().findById(getDefaultProfileId());

		const wallet = await profile
			.wallets()
			.importByAddress("AdVSe37niA3uFUPgCgMUH2tMsHF4LpLoiX", "ARK", "ark.mainnet");

		await syncDelegates();
		await wallet.syncVotes();

		wallets = profile.wallets().values();
	});

	it("should return empty wallets", async () => {
		const wrapper = ({ children }: any) => <EnvironmentProvider env={env}> {children} </EnvironmentProvider>;
		const { result } = renderHook(() => useWalletDisplay({ selectedNetworkIds: ["ark.devnet"] }), {
			wrapper,
		});

		expect(result.current.listWallets).toHaveLength(0);
	});

	it("should return list type wallets", async () => {
		const wrapper = ({ children }: any) => <EnvironmentProvider env={env}> {children} </EnvironmentProvider>;
		const { result } = renderHook(() => useWalletDisplay({ wallets, selectedNetworkIds: ["ark.devnet"] }), {
			wrapper,
		});

		expect(result.current.listWallets).toHaveLength(2);
		expect(result.current.listHasMore).toBe(false);
	});

	it("should limit list type wallets", async () => {
		const wrapper = ({ children }: any) => <EnvironmentProvider env={env}> {children} </EnvironmentProvider>;
		const { result } = renderHook(
			() =>
				useWalletDisplay({
					wallets,
					selectedNetworkIds: ["ark.devnet", "ark.mainnet"],
					viewMore: true,
					listPagerLimit: 1,
				}),
			{
				wrapper,
			},
		);

		expect(result.current.listWallets).toHaveLength(3);
	});

	it("should ignore list pager limit", async () => {
		const wrapper = ({ children }: any) => <EnvironmentProvider env={env}> {children} </EnvironmentProvider>;
		const { result } = renderHook(
			() =>
				useWalletDisplay({
					wallets,
					selectedNetworkIds: ["ark.devnet", "ark.mainnet"],
					viewMore: true,
					listPagerLimit: 1,
				}),
			{
				wrapper,
			},
		);

		expect(result.current.listWallets).toHaveLength(3);
	});

	it("should filter wallets by selectedNetworkIds", async () => {
		const wrapper = ({ children }: any) => <EnvironmentProvider env={env}> {children} </EnvironmentProvider>;
		const { result } = renderHook(() => useWalletDisplay({ wallets, selectedNetworkIds: [] }), {
			wrapper,
		});

		expect(result.current.listWallets).toHaveLength(0);
	});

	it("should return listHasMore boolean", async () => {
		const wrapper = ({ children }: any) => <EnvironmentProvider env={env}> {children} </EnvironmentProvider>;
		const { result } = renderHook(
			() => useWalletDisplay({ wallets, selectedNetworkIds: ["ark.devnet"], listPagerLimit: 1, viewMore: false }),
			{
				wrapper,
			},
		);

		expect(result.current.listHasMore).toBe(true);
	});

	it("should filter wallet types", async () => {
		const wrapper = ({ children }: any) => <EnvironmentProvider env={env}> {children} </EnvironmentProvider>;
		const { result } = renderHook(
			() =>
				useWalletDisplay({
					wallets,
					selectedNetworkIds: ["ark.devnet", "ark.mainnet"],
					displayType: "favorites",
				}),
			{
				wrapper,
			},
		);

		expect(result.current.listWallets).toHaveLength(0);
	});

	it("shoudl return 2 grid wallet padded with 1 additional empty grid wallet", async () => {
		const wrapper = ({ children }: any) => <EnvironmentProvider env={env}> {children} </EnvironmentProvider>;
		const { result } = renderHook(() => useWalletDisplay({ wallets, selectedNetworkIds: ["ark.devnet"] }), {
			wrapper,
		});

		expect(result.current.gridWallets).toHaveLength(3);
	});

	it("should return all grid wallets", async () => {
		const wrapper = ({ children }: any) => <EnvironmentProvider env={env}> {children} </EnvironmentProvider>;
		await profile.wallets().importByMnemonic("test", "ARK", "ark.devnet");
		await profile.wallets().importByMnemonic("test2", "ARK", "ark.devnet");
		const ledger = await profile.wallets().importByMnemonic("test3", "ARK", "ark.devnet");
		const ledgerMock = jest.spyOn(ledger, "isLedger").mockReturnValue(true);

		const { result } = renderHook(
			() =>
				useWalletDisplay({
					wallets: profile.wallets().values(),
					selectedNetworkIds: ["ark.devnet", "ark.mainnet"],
				}),
			{
				wrapper,
			},
		);

		expect(result.current.gridWallets).toHaveLength(6);
		ledgerMock.mockRestore();
	});

	it("should filter ledger grid wallets", async () => {
		const wrapper = ({ children }: any) => <EnvironmentProvider env={env}> {children} </EnvironmentProvider>;
		const ledger = await profile.wallets().importByMnemonic("test4", "ARK", "ark.devnet");
		const ledgerMock = jest.spyOn(ledger, "isLedger").mockReturnValue(true);

		const { result } = renderHook(
			() =>
				useWalletDisplay({
					wallets: profile.wallets().values(),
					selectedNetworkIds: ["ark.devnet", "ark.mainnet"],
					displayType: "ledger",
				}),
			{
				wrapper,
			},
		);

		expect(result.current.gridWallets).toHaveLength(3);
		ledgerMock.mockRestore();
	});
});
