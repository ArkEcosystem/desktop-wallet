/* eslint-disable @typescript-eslint/require-await */
import { act, renderHook } from "@testing-library/react-hooks";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { fireEvent, render, waitFor } from "testing-library";

import { translations } from "../../i18n";
import { FeeWarning, FeeWarningVariant } from "./FeeWarning";

describe("FeeWarning", () => {
	it("should not render if not open", () => {
		const { result: form } = renderHook(() => useForm());

		const { asFragment, getByTestId } = render(
			<FormProvider {...form.current}>
				<FeeWarning isOpen={false} onCancel={jest.fn()} onConfirm={jest.fn()} />
			</FormProvider>,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		expect(asFragment()).toMatchSnapshot();
	});

	it.each([FeeWarningVariant.Low, FeeWarningVariant.High])(
		"should render a warning for a fee that is too %s",
		(variant) => {
			const { result: form } = renderHook(() => useForm());

			const { asFragment, getByTestId } = render(
				<FormProvider {...form.current}>
					<FeeWarning isOpen={true} variant={variant} onCancel={jest.fn()} onConfirm={jest.fn()} />
				</FormProvider>,
			);

			expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_FEE_WARNING.TITLE);
			expect(getByTestId("modal__inner")).toHaveTextContent(
				translations.MODAL_FEE_WARNING.DESCRIPTION[`TOO_${variant}`],
			);

			expect(asFragment()).toMatchSnapshot();
		},
	);

	it("should call onCancel callback when closing the modal", () => {
		const { result: form } = renderHook(() => useForm());

		const onCancel = jest.fn();

		const { getByTestId } = render(
			<FormProvider {...form.current}>
				<FeeWarning isOpen={true} onCancel={onCancel} onConfirm={jest.fn()} />
			</FormProvider>,
		);

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});

		expect(onCancel).toHaveBeenCalled();
	});

	it("should call onCancel callback when clicking on cancel button", () => {
		const { result: form } = renderHook(() => useForm());

		const onCancel = jest.fn();

		const { getByTestId } = render(
			<FormProvider {...form.current}>
				<FeeWarning isOpen={true} onCancel={onCancel} onConfirm={jest.fn()} />
			</FormProvider>,
		);

		act(() => {
			fireEvent.click(getByTestId("FeeWarning__cancel-button"));
		});

		expect(onCancel).toHaveBeenCalled();
	});

	it.each([true, false])(
		"should pass %s to onConfirm callback when clicking on continue button",
		(suppressWarning) => {
			const { result: form } = renderHook(() => useForm());

			const onConfirm = jest.fn();

			const { getByTestId } = render(
				<FormProvider {...form.current}>
					<FeeWarning isOpen={true} onCancel={jest.fn()} onConfirm={onConfirm} />
				</FormProvider>,
			);

			if (suppressWarning) {
				act(() => {
					fireEvent.click(getByTestId("FeeWarning__suppressWarning-toggle"));
				});
			}

			act(() => {
				fireEvent.click(getByTestId("FeeWarning__continue-button"));
			});

			waitFor(() => {
				expect(onConfirm).toHaveBeenCalledWith(suppressWarning);
			});
		},
	);
});
