/* eslint-disable @typescript-eslint/require-await */
import { act, renderHook } from "@testing-library/react-hooks";
import React from "react";
import { FormContext, useForm } from "react-hook-form";
import { fireEvent, render, RenderResult, waitFor } from "test-utils";

import { FirstStep, FourthStep, SecondStep, SendIPFSTransaction, ThirdStep } from "./SendIPFSTransaction";

describe("SendIPFSTransaction", () => {
	const onCopy = jest.fn();

	it("should render 1st step", async () => {
		const { result: form } = renderHook(() => useForm());
		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<FirstStep />
			</FormContext>,
		);

		expect(getByTestId("SendIPFSTransaction__step--first")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 2nd step", async () => {
		const { getByTestId, asFragment } = render(<SecondStep />);

		expect(getByTestId("SendIPFSTransaction__step--second")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 3rd step", async () => {
		const { result: form } = renderHook(() => useForm());
		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<ThirdStep />
			</FormContext>,
		);

		expect(getByTestId("SendIPFSTransaction__step--third")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 4th step", async () => {
		const { result: form } = renderHook(() => useForm());

		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<FourthStep />
			</FormContext>,
		);

		expect(getByTestId("TransactionSuccessful")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render", async () => {
		let rendered: RenderResult;

		await act(async () => {
			rendered = render(<SendIPFSTransaction onCopy={onCopy} />);
			await waitFor(() => expect(rendered.getByTestId(`SendIPFSTransaction__step--first`)).toBeTruthy());
		});

		const { getByTestId, asFragment } = rendered!;

		expect(asFragment()).toMatchSnapshot();

		await act(async () => {
			const continueButton = getByTestId(`SendIPFSTransaction__button--continue`);

			// Navigation between steps
			await waitFor(() => expect(continueButton).not.toHaveAttribute("disabled"));

			fireEvent.click(continueButton);
			expect(getByTestId(`SendIPFSTransaction__step--second`)).toBeTruthy();

			fireEvent.click(continueButton);
			expect(getByTestId(`SendIPFSTransaction__step--third`)).toBeTruthy();

			// Back
			fireEvent.click(getByTestId(`SendIPFSTransaction__button--back`));
			expect(getByTestId(`SendIPFSTransaction__step--second`)).toBeTruthy();

			fireEvent.click(continueButton);
			fireEvent.click(continueButton);
			await waitFor(() => expect(getByTestId(`SendIPFSTransaction__button--back-to-wallet`)).toBeTruthy());
		});
	});
});
