/* eslint-disable @typescript-eslint/require-await */
import { renderHook } from "@testing-library/react-hooks";
import { ConfigurationProvider } from "app/contexts";
import React from "react";
import { env, getDefaultProfileId } from "utils/testing-library";
import { useProfileBalance } from "./use-profile-balance";
import { BigNumber } from "@arkecosystem/platform-sdk-support";

describe("useProfileBalance", () => {
	it("should get converted balance", async () => {
		const profile = env.profiles().findById(getDefaultProfileId());
		const wrapper = ({ children }: any) => <ConfigurationProvider>{children}</ConfigurationProvider>;

		const {
			result: { current },
		} = renderHook(() => useProfileBalance({ profile }), { wrapper });

		expect(current.convertedBalance).toEqual(BigNumber.ZERO);
	});

	it("should get zero balance if loading", async () => {
		const profile = env.profiles().findById(getDefaultProfileId());
		const wrapper = ({ children }: any) => <ConfigurationProvider>{children}</ConfigurationProvider>;

		const {
			result: { current },
		} = renderHook(() => useProfileBalance({ profile, isLoading: true }), { wrapper });

		expect(current.convertedBalance).toEqual(BigNumber.ZERO);
	});

	it("should default to zero when exception is thrown", async () => {
		const profile = env.profiles().findById(getDefaultProfileId());
		const profileConvertedBalanceMock = jest.spyOn(profile, "convertedBalance").mockImplementation(() => {
			throw new Error("profile is not restored");
		});

		const wrapper = ({ children }: any) => <ConfigurationProvider>{children}</ConfigurationProvider>;

		const {
			result: { current },
		} = renderHook(() => useProfileBalance({ profile }), { wrapper });

		expect(current.convertedBalance).toEqual(BigNumber.ZERO);
		profileConvertedBalanceMock.mockRestore();
	});

	it("should default to zero if converted balance is undefined", async () => {
		const profile = env.profiles().findById(getDefaultProfileId());
		const profileConvertedBalanceMock = jest.spyOn(profile, "convertedBalance").mockReturnValue(undefined);

		const wrapper = ({ children }: any) => <ConfigurationProvider>{children}</ConfigurationProvider>;

		const {
			result: { current },
		} = renderHook(() => useProfileBalance({ profile }), { wrapper });

		expect(current.convertedBalance).toEqual(BigNumber.ZERO);
		profileConvertedBalanceMock.mockRestore();
	});
});
