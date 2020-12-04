/* eslint-disable @typescript-eslint/require-await */
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { renderHook } from "@testing-library/react-hooks";
import { EnvironmentProvider } from "app/contexts";
import React from "react";
import { env, getDefaultProfileId } from "utils/testing-library";

import { usePortfolioData } from "./";

let profile: Profile;
describe("usePortfolioData hook", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
	});

	it("should return chartLines", async () => {
		const wrapper = ({ children }: any) => <EnvironmentProvider env={env}> {children} </EnvironmentProvider>;
		const { result } = renderHook(() => usePortfolioData({ profile }), { wrapper });

		expect(() => result.current.chartLines).toBeTruthy();
	});

	it("should return empty percentages", async () => {
		const wrapper = ({ children }: any) => <EnvironmentProvider env={env}> {children} </EnvironmentProvider>;
		const { result } = renderHook(() => usePortfolioData({ profile }), { wrapper });

		expect(result.current.percentages).toEqual([]);
	});

	it("should return percentages", async () => {
		//@ts-ignore
		const balancePerCoinMock = jest
			.spyOn(profile.walletAggregate(), "balancePerCoin")
			.mockImplementation(() => ({ ARK: { total: 10, percentage: 3 } }));

		const wrapper = ({ children }: any) => <EnvironmentProvider env={env}> {children} </EnvironmentProvider>;
		const { result } = renderHook(() => usePortfolioData({ profile }), { wrapper });

		expect(result.current.percentages).toEqual([{ color: "danger-400", label: "ARK", percentage: 3 }]);
		balancePerCoinMock.mockRestore();
	});

	it("should return balances", async () => {
		const wrapper = ({ children }: any) => <EnvironmentProvider env={env}> {children} </EnvironmentProvider>;
		const { result } = renderHook(() => usePortfolioData({ profile }), { wrapper });

		expect(() => result.current.balances).toBeTruthy();
	});
});
