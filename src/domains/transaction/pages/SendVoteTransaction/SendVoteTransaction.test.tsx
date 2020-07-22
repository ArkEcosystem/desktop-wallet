/* eslint-disable @typescript-eslint/require-await */
import { act, renderHook } from "@testing-library/react-hooks";
import { createMemoryHistory } from "history";
import React from "react";
import { FormContext, useForm } from "react-hook-form";
import { Route } from "react-router-dom";
import { fireEvent, render, RenderResult, renderWithRouter, waitFor } from "testing-library";
import { identity } from "tests/fixtures/identity";

import { FirstStep, FourthStep, SecondStep, SendVoteTransaction, ThirdStep } from "../SendVoteTransaction";

const onCopy = jest.fn();

describe("Vote For Delegate", () => {
	it("should render 1st step", async () => {
		const { result: form } = renderHook(() => useForm());
		const { getByTestId, asFragment } = render(
			<FormContext {...form.current}>
				<FirstStep />
			</FormContext>,
		);

		expect(getByTestId("SendVoteTransaction__step--first")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 2nd step", async () => {
		const { getByTestId, asFragment } = render(<SecondStep />);

		expect(getByTestId("SendVoteTransaction__step--second")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 3rd step", async () => {
		const { result: form } = renderHook(() => useForm());
		const { getByTestId, asFragment } = render(<ThirdStep form={form} passwordType="mnemonic" />);

		expect(getByTestId("SendVoteTransaction__step--third")).toBeTruthy();
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
		const history = createMemoryHistory();
		const voteURL = `/profiles/${identity.profiles.bob.id}/transactions/vote`;

		history.push(voteURL);

		let rendered: RenderResult;

		await act(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/transactions/vote">
					<SendVoteTransaction onCopy={onCopy} />
				</Route>,
				{
					routes: [voteURL],
					history,
				},
			);

			await waitFor(() => expect(rendered.getByTestId(`SendVoteTransaction__step--first`)).toBeTruthy());
		});

		const { getByTestId, asFragment } = rendered!;

		expect(asFragment()).toMatchSnapshot();

		await act(async () => {
			const continueButton = getByTestId(`SendVoteTransaction__button--continue`);

			// Navigation between steps
			await waitFor(() => expect(continueButton).not.toHaveAttribute("disabled"));

			fireEvent.click(continueButton);
			expect(getByTestId(`SendVoteTransaction__step--second`)).toBeTruthy();

			fireEvent.click(continueButton);
			expect(getByTestId(`SendVoteTransaction__step--third`)).toBeTruthy();

			// Back
			fireEvent.click(getByTestId(`SendVoteTransaction__button--back`));
			expect(getByTestId(`SendVoteTransaction__step--second`)).toBeTruthy();

			fireEvent.click(continueButton);
			fireEvent.click(continueButton);
			await waitFor(() => expect(getByTestId(`SendVoteTransaction__button--back-to-wallet`)).toBeTruthy());
		});
	});
});
