/* eslint-disable @typescript-eslint/require-await */
import { act, renderHook } from "@testing-library/react-hooks";
import React from "react";
import { FormContext, useForm } from "react-hook-form";
import { fireEvent, render, RenderResult, waitFor } from "testing-library";

import { networks } from "../../data";
import { CreateWallet, FirstStep, FourthStep, SecondStep, ThirdStep } from "./CreateWallet";

describe("CreateWallet", () => {
	const mnemonic = ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur"];

	const onSubmit = jest.fn();
	const onCopy = jest.fn();
	const onDownload = jest.fn();

	it("should render 1st step", async () => {
		const { result: form } = renderHook(() => useForm());
		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<FirstStep networks={networks} />
			</FormContext>,
		);

		expect(getByTestId(`CreateWallet__first-step`)).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		const selectAssetsInput = getByTestId("select-asset__input");
		expect(selectAssetsInput).toBeTruthy();

		await act(async () => {
			fireEvent.change(selectAssetsInput, { target: { value: "Bitco" } });
		});

		await act(async () => {
			fireEvent.keyDown(selectAssetsInput, { key: "Enter", code: 13 });
		});

		expect(getByTestId("select-asset__selected-Bitcoin")).toBeTruthy();
	});

	it("should render 2nd step", async () => {
		const { getByTestId, asFragment } = render(
			<SecondStep mnemonic={mnemonic} onCopy={onCopy} onDownload={onDownload} />,
		);

		expect(getByTestId(`CreateWallet__second-step`)).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		fireEvent.click(getByTestId(`CreateWallet__copy`));
		expect(onCopy).toHaveBeenCalled();

		fireEvent.click(getByTestId(`CreateWallet__download`));
		expect(onDownload).toHaveBeenCalled();
	});

	it("should render 3rd step", async () => {
		const { result: form } = renderHook(() => useForm());
		const { getByTestId, getAllByTestId } = render(
			<FormContext {...form.current}>
				<ThirdStep mnemonic={mnemonic} skipVerification={false} />
			</FormContext>,
		);

		expect(getByTestId(`CreateWallet__third-step`)).toBeTruthy();
		expect(getAllByTestId(`MnemonicVerificationOptions__button`).length).toBeGreaterThan(1);

		expect(form.current.getValues()).toEqual({ verification: undefined });
	});

	it("should render 3rd step without verification", async () => {
		const { result: form } = renderHook(() => useForm());

		await act(async () => {
			render(
				<FormContext {...form.current}>
					<ThirdStep mnemonic={mnemonic} skipVerification={true} />
				</FormContext>,
			);
		});
		expect(form.current.getValues()).toEqual({ verification: true });
	});

	it("should render 4th step", async () => {
		const { result: form } = renderHook(() =>
			useForm({
				defaultValues: {
					network: networks[0],
				},
			}),
		);

		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<FourthStep />
			</FormContext>,
		);

		expect(getByTestId(`CreateWallet__fourth-step`)).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		expect(getByTestId(`CrateWallet__network-name`)).toHaveTextContent(networks[0].name);

		const walletNameInput = getByTestId("CreateWallet__wallet-name");

		// Submit
		await act(async () => {
			fireEvent.change(walletNameInput, { target: { value: "Test" } });
		});

		expect(form.current.getValues()).toEqual({ name: "Test" });
	});

	it("should render", async () => {
		let rendered: RenderResult;

		await act(async () => {
			rendered = render(
				<CreateWallet
					onSubmit={onSubmit}
					onCopy={onCopy}
					onDownload={onDownload}
					mnemonic={mnemonic}
					networks={networks}
					skipMnemonicVerification={true}
				/>,
			);
			await waitFor(() => expect(rendered.getByTestId(`CreateWallet__first-step`)).toBeTruthy());
		});

		const { getByTestId, asFragment } = rendered!;

		expect(asFragment()).toMatchSnapshot();

		const selectAssetsInput = getByTestId("select-asset__input");
		await act(async () => {
			const continueButton = getByTestId(`CreateWallet__continue-button`);

			// Navigation between steps
			fireEvent.change(selectAssetsInput, { target: { value: "Bitco" } });
			fireEvent.keyDown(selectAssetsInput, { key: "Enter", code: 13 });
			await waitFor(() => expect(continueButton).not.toHaveAttribute("disabled"));

			fireEvent.click(continueButton);
			expect(getByTestId(`CreateWallet__second-step`)).toBeTruthy();

			fireEvent.click(continueButton);
			expect(getByTestId(`CreateWallet__third-step`)).toBeTruthy();

			fireEvent.click(continueButton);

			// Submit

			fireEvent.click(getByTestId(`CreateWallet__save-button`));

			// Back
			fireEvent.click(getByTestId(`CreateWallet__back-button`));
			await waitFor(() => expect(getByTestId(`CreateWallet__third-step`)).toBeTruthy());

			// expect(getByTestId(`CreateWallet__third-step`)).toBeTruthy();
		});

		expect(onSubmit).toHaveBeenCalledWith({ name: "", network: networks[1].name });
	});
});
