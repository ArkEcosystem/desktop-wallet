/* eslint-disable @typescript-eslint/require-await */
import { act, fireEvent, render } from "@testing-library/react";
import React from "react";

import { Clipboard } from "./Clipboard";

describe("Clipboard", () => {
	it("should render not render without children", () => {
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
				<Clipboard data={123} options={{ resetAfter: 1000, onSuccess }}>
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
