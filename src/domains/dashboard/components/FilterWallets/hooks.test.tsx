import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { act, renderHook } from "@testing-library/react-hooks";
import { ConfigurationProvider, EnvironmentProvider } from "app/contexts";
import React from "react";
import { env, getDefaultProfileId, waitFor } from "utils/testing-library";

import { useWalletFilters } from "./hooks";

let profile: Profile;

describe("useWalletFilters", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
	});

	it("should match default filters", () => {
		const wrapper = ({ children }: any) => (
			<EnvironmentProvider env={env}>
				<ConfigurationProvider>{children}</ConfigurationProvider>
			</EnvironmentProvider>
		);

		const {
			result: { current },
		} = renderHook(() => useWalletFilters({ profile }), { wrapper });

		expect(current.isFilterChanged).toBe(false);
	});

	it("should change view type filter", async () => {
		const wrapper = ({ children }: any) => (
			<EnvironmentProvider env={env}>
				<ConfigurationProvider>{children}</ConfigurationProvider>
			</EnvironmentProvider>
		);

		const { result } = renderHook(() => useWalletFilters({ profile }), { wrapper });

		expect(result.current.isFilterChanged).toBe(false);

		act(() => {
			result.current.update("viewType", "list");
		});

		expect(result.current.isFilterChanged).toBe(false);
		await waitFor(() => expect(result.current.viewType).toBe("list"));
	});

	it("should toggle network selection", async () => {
		const wrapper = ({ children }: any) => (
			<EnvironmentProvider env={env}>
				<ConfigurationProvider>{children}</ConfigurationProvider>
			</EnvironmentProvider>
		);

		const { result } = renderHook(() => useWalletFilters({ profile }), { wrapper });

		act(() => {
			result.current.update("viewType", "grid");
			result.current.update("selectedNetworkIds", []);
		});

		expect(result.current.isFilterChanged).toBe(true);
		await waitFor(() => expect(result.current.viewType).toBe("grid"));
	});

	it("should toggle wallet display type filter", async () => {
		const wrapper = ({ children }: any) => (
			<EnvironmentProvider env={env}>
				<ConfigurationProvider>{children}</ConfigurationProvider>
			</EnvironmentProvider>
		);

		const { result } = renderHook(() => useWalletFilters({ profile }), { wrapper });

		act(() => {
			result.current.update("walletsDisplayType", "favorites");
		});

		expect(result.current.isFilterChanged).toBe(true);
		await waitFor(() => expect(result.current.walletsDisplayType).toBe("favorites"));
	});
});
