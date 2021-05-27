/* eslint-disable @typescript-eslint/require-await */
import React from "react";
import { act, fireEvent, render, screen } from "utils/testing-library";

import { Clipboard } from "./Clipboard";

type VariantType = "icon" | "button";

describe("Clipboard", () => {
	beforeAll(() => {
		(navigator as any).clipboard = {
			writeText: jest.fn().mockResolvedValue("test"),
		};
	});

	afterAll(() => {
		(navigator as any).clipboard.writeText.mockRestore();
	});

	it.each<VariantType>(["icon", "button"])("should not render without children in variant type '%s'", (variant) => {
		// @ts-ignore
		const { asFragment } = render(<Clipboard variant={variant} data="" />);

		expect(screen.queryByTestId(`clipboard-${variant}__wrapper`)).not.toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();
	});

	it.each<VariantType>(["icon", "button"])("should render with children in variant type '%s'", (variant) => {
		const { asFragment } = render(
			<Clipboard variant={variant} data="">
				<span>Hello!</span>
			</Clipboard>,
		);

		expect(screen.queryByTestId(`clipboard-${variant}__wrapper`)).toHaveTextContent("Hello!");
		expect(asFragment()).toMatchSnapshot();
	});

	it.each([
		["string", "test string"],
		["object", { hello: "world" }],
	])("should work with data with type '%s'", async (dataType, data) => {
		jest.useFakeTimers();

		const onError = jest.fn();

		const { getByTestId } = render(
			<Clipboard variant="icon" data={data} options={{ resetAfter: 1000, onError }}>
				<span>Hello!</span>
			</Clipboard>,
		);

		await act(async () => {
			fireEvent.click(getByTestId("clipboard-icon__wrapper"));
		});

		act(() => {
			jest.runOnlyPendingTimers();
		});

		expect(onError).not.toHaveBeenCalled();
	});

	describe("on success", () => {
		it.each<VariantType>(["icon", "button"])(
			"should execute the onSuccess callback if given in variant type '%s'",
			async (variant) => {
				const onSuccess = jest.fn();

				const { getByTestId } = render(
					<Clipboard variant={variant} data="" options={{ onSuccess }}>
						<span>Hello!</span>
					</Clipboard>,
				);

				await act(async () => {
					fireEvent.click(getByTestId(`clipboard-${variant}__wrapper`));
				});

				expect(onSuccess).toHaveBeenCalled();
			},
		);

		it.each<VariantType>(["icon", "button"])(
			"should execute no callback if missing in variant type '%s'",
			async (variant) => {
				const onSuccess = jest.fn();

				const { getByTestId } = render(
					<Clipboard variant={variant} data="">
						<span>Hello!</span>
					</Clipboard>,
				);

				await act(async () => {
					fireEvent.click(getByTestId(`clipboard-${variant}__wrapper`));
				});

				expect(onSuccess).not.toHaveBeenCalled();
			},
		);
	});

	describe("on error", () => {
		beforeAll(() => {
			(navigator as any).clipboard = {
				writeText: jest.fn().mockRejectedValue(new Error()),
			};
		});

		it.each<VariantType>(["icon", "button"])(
			"should execute the onError callback if given in variant type '%s'",
			async (variant) => {
				const onError = jest.fn();

				const { getByTestId } = render(
					<Clipboard variant={variant} data="" options={{ onError }}>
						<span>Hello!</span>
					</Clipboard>,
				);

				await act(async () => {
					fireEvent.click(getByTestId(`clipboard-${variant}__wrapper`));
				});

				expect(onError).toHaveBeenCalled();
			},
		);

		it.each<VariantType>(["icon", "button"])(
			"should execute no callback if missing in variant type '%s'",
			async (variant) => {
				const onError = jest.fn();

				const { getByTestId } = render(
					<Clipboard variant={variant} data="">
						<span>Hello!</span>
					</Clipboard>,
				);

				await act(async () => {
					fireEvent.click(getByTestId(`clipboard-${variant}__wrapper`));
				});

				expect(onError).not.toHaveBeenCalled();
			},
		);
	});
});
