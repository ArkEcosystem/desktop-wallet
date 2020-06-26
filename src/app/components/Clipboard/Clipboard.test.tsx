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

	it("should stringify the data if it is not a string", async () => {
		const writeTextMock = jest.fn().mockResolvedValue();

		navigator.clipboard = {
			writeText: writeTextMock,
		};

		const data = { hello: "world" };

		const { getByTestId } = render(
			<Clipboard data={data}>
				<span>Hello!</span>
			</Clipboard>,
		);

		await act(async () => {
			fireEvent.click(getByTestId("clipboard__wrapper"));
		});

		expect(writeTextMock).toHaveBeenCalledWith('{"hello":"world"}');

		navigator.clipboard.writeText.mockRestore();
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
				<Clipboard onSuccess={onSuccess}>
					<span>Hello!</span>
				</Clipboard>,
			);

			await act(async () => {
				fireEvent.click(getByTestId("clipboard__wrapper"));
			});

			expect(onSuccess).toHaveBeenCalled();
		});

		it("should execute no callback if missing", () => {
			const onSuccess = jest.fn();

			const { getByTestId } = render(
				<Clipboard>
					<span>Hello!</span>
				</Clipboard>,
			);

			fireEvent.click(getByTestId("clipboard__wrapper"));

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
				<Clipboard onError={onError}>
					<span>Hello!</span>
				</Clipboard>,
			);

			await act(async () => {
				fireEvent.click(getByTestId("clipboard__wrapper"));
			});

			expect(onError).toHaveBeenCalled();
		});

		it("should execute no callback if missing", () => {
			const onError = jest.fn();

			const { getByTestId } = render(
				<Clipboard>
					<span>Hello!</span>
				</Clipboard>,
			);

			fireEvent.click(getByTestId("clipboard__wrapper"));

			expect(onError).not.toHaveBeenCalled();
		});
	});
});
