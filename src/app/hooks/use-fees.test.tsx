import { ARK } from "@arkecosystem/platform-sdk-ark";
import { renderHook } from "@testing-library/react-hooks";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import React from "react";
import { StubStorage } from "tests/mocks";
import { env, getDefaultProfileId } from "utils/testing-library";

import { useFees } from "./use-fees";

describe("useFees", () => {
	it("should find fees by type if already synced", async () => {
		const profile = env.profiles().findById(getDefaultProfileId());

		await env.wallets().syncByProfile(profile);
		await env.fees().syncAll();
		await env.delegates().syncAll();

		const wrapper = ({ children }: any) => <EnvironmentProvider env={env}>{children} </EnvironmentProvider>;
		const {
			result: { current },
		} = renderHook(() => useFees(), { wrapper });

		expect(current.findByType("ARK", "ark.devnet", "ipfs")).resolves.toEqual({
			static: "500000000",
			max: "500000000",
			min: "500000000",
			avg: "500000000",
		});
	});

	it("should ensure fees are synced before find", async () => {
		env.reset({ coins: { ARK }, httpClient, storage: new StubStorage() });

		const profile = env.profiles().create("John Doe");
		await profile.wallets().generate("ARK", "ark.devnet");
		await env.wallets().syncByProfile(profile);

		const wrapper = ({ children }: any) => <EnvironmentProvider env={env}>{children} </EnvironmentProvider>;
		const {
			result: { current },
		} = renderHook(() => useFees(), { wrapper });

		expect(current.findByType("ARK", "ark.devnet", "ipfs")).resolves.toEqual({
			static: "500000000",
			max: "500000000",
			min: "500000000",
			avg: "500000000",
		});
	});
});
