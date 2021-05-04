/* eslint-disable @typescript-eslint/require-await */
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

		const mockUsesPassword = jest.spyOn(profile, "usesPassword").mockImplementation(() => true);

		const mockPasswordLessProfile = jest.spyOn(passwordLessProfile, "usesPassword").mockImplementation(() => false);

		const memoryPasswordMock = jest.spyOn(profile.password(), "get").mockImplementation(() => {
			throw new Error("password not found");
		});

		const {
			result: { current },
		} = renderHook(() => useProfileUtils(env), { wrapper });

		expect(current.getProfileStoredPassword(profile)).toEqual(undefined);
		expect(current.getProfileStoredPassword(passwordLessProfile)).toEqual(undefined);

		memoryPasswordMock.mockRestore();

		const passwordMock = jest.spyOn(profile.password(), "get").mockImplementation(() => "password");

		expect(current.getProfileStoredPassword(profile)).toEqual("password");

		mockUsesPassword.mockRestore();
		mockPasswordLessProfile.mockRestore();
		passwordMock.mockRestore();
	});

	it("#getErroredNetworks", async () => {
		const profile = env.profiles().findById(getDefaultProfileId());

		const wrapper = ({ children }: any) => <ConfigurationProvider>{children}</ConfigurationProvider>;

		const {
			result: { current },
		} = renderHook(() => useProfileUtils(env), { wrapper });

		await profile.wallets().restore();
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
