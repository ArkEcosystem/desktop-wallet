/* eslint-disable @typescript-eslint/require-await */
import { act, renderHook } from "@testing-library/react-hooks";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { fireEvent, render, waitFor } from "utils/testing-library";

import { EncryptPasswordStep } from "./EncryptPasswordStep";

describe("EncryptPasswordStep", () => {
	it("should render", () => {
		const { result: form } = renderHook(() => useForm());
		const { getByTestId, asFragment } = render(
			<FormProvider {...form.current}>
				<EncryptPasswordStep />
			</FormProvider>,
		);

		expect(getByTestId("EncryptPassword")).toBeInTheDocument();
		expect(asFragment).toMatchSnapshot();
	});

	it("should change password", async () => {
		const { result: form } = renderHook(() => useForm());
		const { getAllByTestId, asFragment } = render(
			<FormProvider {...form.current}>
				<EncryptPasswordStep />
			</FormProvider>,
		);

		expect(getAllByTestId("InputPassword").length).toEqual(2);
		const passwordField = getAllByTestId("InputPassword")[0];

		await act(async () => {
			fireEvent.input(passwordField, {
				target: {
					value: "password",
				},
			});
		});

		await waitFor(() => expect(passwordField).toHaveValue("password"));
		expect(asFragment).toMatchSnapshot();
	});

	it("should trigger password confirmation validation when password is entered", async () => {
		const { result: form } = renderHook(() =>
			useForm({ defaultValues: { confirmEncryptionPassword: "password" } }),
		);
		const { getAllByTestId, asFragment } = render(
			<FormProvider {...form.current}>
				<EncryptPasswordStep />
			</FormProvider>,
		);

		expect(getAllByTestId("InputPassword").length).toEqual(2);
		const passwordField = getAllByTestId("InputPassword")[0];
		const confirmPasswordField = getAllByTestId("InputPassword")[1];

		await act(async () => {
			fireEvent.input(passwordField, {
				target: {
					value: "password",
				},
			});
		});

		await waitFor(() => expect(passwordField).toHaveValue("password"));
		await waitFor(() => expect(confirmPasswordField).toHaveValue("password"));
		expect(asFragment).toMatchSnapshot();
	});
});
