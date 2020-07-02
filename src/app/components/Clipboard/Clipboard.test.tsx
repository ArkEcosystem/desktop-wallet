/* eslint-disable @typescript-eslint/require-await */
import { translations } from "app/i18n/common/i18n";
import React from "react";
import { act, fireEvent, render } from "testing-library";

import { Clipboard } from "./Clipboard";

describe("Clipboard", () => {
	beforeAll(() => {
		navigator.clipboard = {
			writeText: jest.fn().mockResolvedValue(),
		};
	});

	afterAll(() => {
		navigator.clipboard.writeText.mockRestore();
	});

	it("should not render without children", () => {
		const { asFragment, getByTestId } = render(<Clipboard />);

		expect(() => getByTestId("clipboard__wrapper")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with children", () => {
		const { asFragment, getByTestId } = render(
			<Clipboard>
				<span>Hello!</span>
			</Clipboard>,
		);

		expect(getByTestId("clipboard__wrapper")).toHaveTextContent("Hello!");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should change the tooltip content when clicked", async () => {
		const { baseElement, getByTestId } = render(
			<Clipboard>
				<span>Hello!</span>
			</Clipboard>,
		);

		act(() => {
			fireEvent.mouseEnter(getByTestId("clipboard__wrapper"));
		});

		expect(baseElement).toHaveTextContent(translations.CLIPBOARD.TOOLTIP_TEXT);
		expect(baseElement).not.toHaveTextContent(translations.CLIPBOARD.SUCCESS);

		await act(async () => {
			fireEvent.click(getByTestId("clipboard__wrapper"));
		});

		expect(baseElement).not.toHaveTextContent(translations.CLIPBOARD.TOOLTIP_TEXT);
		expect(baseElement).toHaveTextContent(translations.CLIPBOARD.SUCCESS);
	});

	it.each([
		["string", "test string"],
		["object", { hello: "world" }],
	])("should work with data with type '%s'", async (dataType, data) => {
		jest.useFakeTimers();

		const onError = jest.fn();

		const { getByTestId } = render(
			<Clipboard data={data} options={{ resetAfter: 1000, onError }}>
				<span>Hello!</span>
			</Clipboard>,
		);

		await act(async () => {
			fireEvent.click(getByTestId("clipboard__wrapper"));
		});

		await act(async () => {
			jest.runAllTimers();
		});

		expect(onError).not.toHaveBeenCalled();
	});

	describe("on success", () => {
		beforeAll(() => {
			navigator.clipboard = {
				writeText: jest.fn().mockResolvedValue(),
			};
		});

		afterAll(() => {
			navigator.clipboard.writeText.mockRestore();
		});

		it("should execute the onSuccess callback if given", async () => {
			const onSuccess = jest.fn();

			const { getByTestId } = render(
				<Clipboard options={{ onSuccess }}>
					<span>Hello!</span>
				</Clipboard>,
			);

			await act(async () => {
				fireEvent.click(getByTestId("clipboard__wrapper"));
			});

			expect(onSuccess).toHaveBeenCalled();
		});

		it("should execute no callback if missing", async () => {
			const onSuccess = jest.fn();

			const { getByTestId } = render(
				<Clipboard>
					<span>Hello!</span>
				</Clipboard>,
			);

			await act(async () => {
				fireEvent.click(getByTestId("clipboard__wrapper"));
			});

			expect(onSuccess).not.toHaveBeenCalled();
		});
	});

	describe("on error", () => {
		beforeAll(() => {
			navigator.clipboard = {
				writeText: jest.fn().mockRejectedValue(new Error()),
			};
		});

		afterAll(() => {
			navigator.clipboard.writeText.mockRestore();
		});

		it("should execute the onError callback if given", async () => {
			const onError = jest.fn();

			const { getByTestId } = render(
				<Clipboard options={{ onError }}>
					<span>Hello!</span>
				</Clipboard>,
			);

			await act(async () => {
				fireEvent.click(getByTestId("clipboard__wrapper"));
			});

			expect(onError).toHaveBeenCalled();
		});

		it("should execute no callback if missing", async () => {
			const onError = jest.fn();

			const { getByTestId } = render(
				<Clipboard>
					<span>Hello!</span>
				</Clipboard>,
			);

			await act(async () => {
				fireEvent.click(getByTestId("clipboard__wrapper"));
			});

			expect(onError).not.toHaveBeenCalled();
		});
	});
});
