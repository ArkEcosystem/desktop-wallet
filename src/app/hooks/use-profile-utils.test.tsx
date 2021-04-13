/* eslint-disable @typescript-eslint/require-await */
import { Helpers } from "@arkecosystem/platform-sdk-profiles";
import { renderHook } from "@testing-library/react-hooks";
import { ConfigurationProvider } from "app/contexts";
import React from "react";
import { env, getDefaultProfileId } from "utils/testing-library";

import { useProfileUtils } from "./use-profile-utils";

describe("useProfileUtils", () => {
	it("#getProfileById", async () => {
		const profile = env.profiles().findById(getDefaultProfileId());

		const wrapper = ({ children }: any) => <ConfigurationProvider>{children}</ConfigurationProvider>;

		const {
			result: { current },
		} = renderHook(() => useProfileUtils(env), { wrapper });

		expect(current.getProfileById(profile.id())).toEqual(profile);

		//@ts-ignore
		expect(current.getProfileById()).not.toEqual(profile);
		expect(current.getProfileById("wrong id")).not.toEqual(profile);
	});

	it("#getProfileFromUrl", async () => {
		const profile = env.profiles().findById(getDefaultProfileId());
		const wrapper = ({ children }: any) => <ConfigurationProvider>{children}</ConfigurationProvider>;

		const {
			result: { current },
		} = renderHook(() => useProfileUtils(env), { wrapper });

		expect(current.getProfileFromUrl(`/profiles/${profile.id()}`)).toEqual(profile);
	});

	it("#getProfileStoredPassword", async () => {
		const profile = env.profiles().findById("cba050f1-880f-45f0-9af9-cfe48f406052");
		const passwordLessProfile = env.profiles().findById(getDefaultProfileId());
		const wrapper = ({ children }: any) => <ConfigurationProvider>{children}</ConfigurationProvider>;
		const memoryPasswordMock = jest.spyOn(Helpers.MemoryPassword, "get").mockImplementation(() => {
			throw new Error("password not found");
		});

		const {
			result: { current },
		} = renderHook(() => useProfileUtils(env), { wrapper });

		expect(current.getProfileStoredPassword(profile)).toEqual(undefined);
		expect(current.getProfileStoredPassword(passwordLessProfile)).toEqual(undefined);
		memoryPasswordMock.mockRestore();

		expect(current.getProfileStoredPassword(profile)).toEqual("password");
	});

	it("#saveProfile", async () => {
		const passwordLessProfile = env.profiles().findById(getDefaultProfileId());
		const passwordProtectedProfile = env.profiles().findById("cba050f1-880f-45f0-9af9-cfe48f406052");

		const wrapper = ({ children }: any) => <ConfigurationProvider>{children}</ConfigurationProvider>;

		const memoryPasswordMock = jest.spyOn(Helpers.MemoryPassword, "get").mockImplementation(() => {
			throw new Error("password not found");
		});

		const {
			result: { current },
		} = renderHook(() => useProfileUtils(env), { wrapper });

		expect(current.saveProfile(passwordLessProfile)).toEqual(undefined);
		expect(current.saveProfile(passwordProtectedProfile)).toEqual(undefined);
		memoryPasswordMock.mockRestore();

		const passwordInMemoryMock = jest.spyOn(Helpers.MemoryPassword, "get").mockReturnValue("password");

		expect(current.saveProfile(passwordProtectedProfile)).toEqual(undefined);
		passwordInMemoryMock.mockRestore();
	});

	it("#getErroredNetworks", async () => {
		const profile = env.profiles().findById(getDefaultProfileId());

		const wrapper = ({ children }: any) => <ConfigurationProvider>{children}</ConfigurationProvider>;

		const {
			result: { current },
		} = renderHook(() => useProfileUtils(env), { wrapper });

		expect(current.getErroredNetworks(profile).hasErroredNetworks).toEqual(false);
		expect(current.getErroredNetworks(profile).erroredNetworks).toHaveLength(0);
	});

	it("should have errored networks", async () => {
		const profile = env.profiles().findById(getDefaultProfileId());
		const walletRestoreMock = jest
			.spyOn(profile.wallets().first(), "hasBeenPartiallyRestored")
			.mockReturnValue(true);

		const wrapper = ({ children }: any) => <ConfigurationProvider>{children}</ConfigurationProvider>;

		const {
			result: { current },
		} = renderHook(() => useProfileUtils(env), { wrapper });

		expect(current.getErroredNetworks(profile).hasErroredNetworks).toEqual(true);
		expect(current.getErroredNetworks(profile).erroredNetworks).toHaveLength(1);
		walletRestoreMock.mockRestore();
	});
});
