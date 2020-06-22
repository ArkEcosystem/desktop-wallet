/* eslint-disable @typescript-eslint/require-await */
import { fireEvent, render, RenderResult, waitFor } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import React from "react";
import { FormContext, useForm } from "react-hook-form";

import { FirstStep, FourthStep, SecondStep, ThirdStep, TransactionSendIPFS } from "./TransactionSendIPFS";

describe("Vote For Delegate", () => {
	const onCopy = jest.fn();

	it("should render 1st step", async () => {
		const { result: form } = renderHook(() => useForm());
		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<FirstStep />
			</FormContext>,
		);

		expect(getByTestId("TransactionSendIPFS__step--first")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 2nd step", async () => {
		const { getByTestId, asFragment } = render(<SecondStep />);

		expect(getByTestId("TransactionSendIPFS__step--second")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 3rd step", async () => {
		const { result: form } = renderHook(() => useForm());
		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<ThirdStep />
			</FormContext>,
		);

		expect(getByTestId("TransactionSendIPFS__step--third")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 4th step", async () => {
		const { result: form } = renderHook(() => useForm());

		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<FourthStep />
			</FormContext>,
		);

		expect(getByTestId("TransactionSendIPFS__step--fourth")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render", async () => {
		let rendered: RenderResult;

		await act(async () => {
			rendered = render(<TransactionSendIPFS onCopy={onCopy} />);
			await waitFor(() => expect(rendered.getByTestId(`TransactionSendIPFS__step--first`)).toBeTruthy());
		});

		const { getByTestId, asFragment } = rendered!;

		expect(asFragment()).toMatchSnapshot();

		await act(async () => {
			const continueButton = getByTestId(`TransactionSendIPFS__button--continue`);

			// Navigation between steps
			await waitFor(() => expect(continueButton).not.toHaveAttribute("disabled"));

			fireEvent.click(continueButton);
			expect(getByTestId(`TransactionSendIPFS__step--second`)).toBeTruthy();

			fireEvent.click(continueButton);
			expect(getByTestId(`TransactionSendIPFS__step--third`)).toBeTruthy();

			// Back
			fireEvent.click(getByTestId(`TransactionSendIPFS__button--back`));
			expect(getByTestId(`TransactionSendIPFS__step--second`)).toBeTruthy();

			fireEvent.click(continueButton);
			fireEvent.click(continueButton);
			await waitFor(() => expect(getByTestId(`TransactionSendIPFS__button--back-to-wallet`)).toBeTruthy());
		});
	});
});
