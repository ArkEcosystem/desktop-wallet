/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { act, renderHook } from "@testing-library/react-hooks";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { env, fireEvent, getDefaultProfileId, render } from "utils/testing-library";

import { SuccessStep } from "./SuccessStep";

describe("SuccessStep", () => {
	let profile: Contracts.IProfile;
	let wallet: Contracts.IReadWriteWallet;

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());

		wallet = profile.wallets().first();
	});

	it("should render 4th step", async () => {
		const { result: form } = renderHook(() =>
			useForm({
				defaultValues: {
					network: wallet.network(),
					wallet,
				},
			}),
		);

		const { asFragment, getByTestId, getByText } = render(
			<FormProvider {...form.current}>
				<SuccessStep profile={profile} />
			</FormProvider>,
		);


		expect(getByTestId("CreateWallet__SuccessStep")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		expect(getByText("ARK Devnet")).toBeTruthy();
		expect(getByText(wallet.address())).toBeTruthy();

		const walletNameInput = getByTestId("CreateWallet__wallet-name");

		expect(walletNameInput).toHaveValue(wallet.alias());

		await act(async () => {
			fireEvent.change(walletNameInput, { target: { value: "Test" } });
		});

		expect(form.current.getValues()).toEqual({ name: "Test" });
	});
});
