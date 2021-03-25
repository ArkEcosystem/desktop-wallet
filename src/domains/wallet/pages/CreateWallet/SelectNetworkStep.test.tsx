/* eslint-disable @typescript-eslint/require-await */
import { ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { act, renderHook } from "@testing-library/react-hooks";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { env, fireEvent, getDefaultProfileId, render } from "utils/testing-library";

import { SelectNetworkStep } from "./SelectNetworkStep";

let profile: Contracts.IProfile;

const fixtureProfileId = getDefaultProfileId();

describe("SelectNetworkStep", () => {
	beforeEach(() => {
		profile = env.profiles().findById(fixtureProfileId);

		for (const wallet of profile.wallets().values()) {
			profile.wallets().forget(wallet.id());
		}
	});

	describe("Render 1st step", () => {
		it("should render", () => {
			const { result: form } = renderHook(() => useForm());
			const { getByTestId, asFragment } = render(
				<FormProvider {...form.current}>
					<SelectNetworkStep env={env} profile={profile} />
				</FormProvider>,
			);

			expect(getByTestId("CreateWallet__SelectNetworkStep")).toBeTruthy();
			expect(asFragment()).toMatchSnapshot();

			const selectNetworkInput = getByTestId("SelectNetworkInput__input");
			expect(selectNetworkInput).toBeTruthy();
		});

		it("should render without test networks", async () => {
			profile.settings().set(ProfileSetting.UseTestNetworks, false);

			const { result: form } = renderHook(() => useForm());
			const { getByTestId, asFragment, queryByTestId } = render(
				<FormProvider {...form.current}>
					<SelectNetworkStep env={env} profile={profile} />
				</FormProvider>,
			);

			expect(getByTestId("CreateWallet__SelectNetworkStep")).toBeTruthy();

			const selectNetworkInput = getByTestId("SelectNetworkInput__input");
			expect(selectNetworkInput).toBeTruthy();

			act(() => {
				fireEvent.focus(selectNetworkInput);
			});

			expect(queryByTestId("NetworkIcon-ARK-ark.mainnet")).toBeInTheDocument();
			expect(queryByTestId("NetworkIcon-ARK-ark.devnet")).toBeNull();

			expect(asFragment()).toMatchSnapshot();

			profile.settings().set(ProfileSetting.UseTestNetworks, true);
		});
	});
});
