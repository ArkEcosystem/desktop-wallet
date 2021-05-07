import { renderHook } from "@testing-library/react-hooks";
import { EnvironmentProvider } from "app/contexts";
import React from "react";
import { env } from "utils/testing-library";

import { useNetworkOptions } from "./use-network-options";

describe("useNetworkOptions hook", () => {
	it("should return network options", () => {
		const wrapper = ({ children }: any) => <EnvironmentProvider env={env}>{children}</EnvironmentProvider>;
		const { result } = renderHook(() => useNetworkOptions(), { wrapper });

		const networks = result.current.networkOptions;

		expect(networks).toContainEqual({ value: "ark.mainnet", label: "ARK Mainnet" });
		expect(networks).toContainEqual({ value: "ark.devnet", label: "ARK Devnet" });
		expect(networks).toContainEqual({ value: "compendia.mainnet", label: "Compendia Mainnet" });
	});

	it("should get a network by its id", () => {
		const id = "ark.mainnet";

		const wrapper = ({ children }: any) => <EnvironmentProvider env={env}> {children} </EnvironmentProvider>;
		const { result } = renderHook(() => useNetworkOptions(), { wrapper });

		const network = result.current.networkById(id);
		expect(network?.id()).toEqual(id);
	});
});
