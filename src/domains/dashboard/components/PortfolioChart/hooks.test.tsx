/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { renderHook } from "@testing-library/react-hooks";
import { EnvironmentProvider } from "app/contexts";
import React from "react";
import { env, getDefaultProfileId } from "utils/testing-library";

import { usePortfolioData } from ".";

let profile: Contracts.IProfile;

describe("usePortfolioData hook", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		await env.profiles().restore(profile);
		await profile.sync();
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
			.spyOn(profile.portfolio(), "breakdown")
			.mockImplementation(() => ({ ARK: { percentage: 3, total: 10 } }));

		const wrapper = ({ children }: any) => <EnvironmentProvider env={env}> {children} </EnvironmentProvider>;
		const { result } = renderHook(() => usePortfolioData({ profile }), { wrapper });

		expect(result.current.percentages).toEqual([{ color: "primary-600", label: "ARK", percentage: 3 }]);

		balancePerCoinMock.mockRestore();
	});

	it("should return balances", async () => {
		const wrapper = ({ children }: any) => <EnvironmentProvider env={env}> {children} </EnvironmentProvider>;
		const { result } = renderHook(() => usePortfolioData({ profile }), { wrapper });

		expect(() => result.current.balances).toBeTruthy();
	});
});
