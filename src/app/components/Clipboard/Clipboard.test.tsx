import { fireEvent, render } from "@testing-library/react";
import React from "react";

import { Clipboard } from "./Clipboard";

describe("Clipboard", () => {
	it("should render not render without children", () => {
		const { asFragment, getByTestId } = render(<Clipboard />);

		expect(() => getByTestId("clipboard__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with children", () => {
		const { asFragment, getByTestId } = render(
			<Clipboard>
				<span>Hello!</span>
			</Clipboard>,
		);

		expect(getByTestId("clipboard__inner")).toHaveTextContent("Hello!");
		expect(getByTestId("clipboard__textarea")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	describe("on success", () => {
		beforeAll(() => {
			document.execCommand = jest.fn();
		});

		afterAll(() => {
			document.execCommand.mockRestore();
		});

		it("should execute the onSuccess callback if given", () => {
			document.execCommand = jest.fn();

			const onSuccess = jest.fn();

			const { getByTestId } = render(
				<Clipboard onSuccess={onSuccess}>
					<span>Hello!</span>
				</Clipboard>,
			);

			fireEvent.click(getByTestId("clipboard__inner"));

			expect(onSuccess).toHaveBeenCalled();
		});

		it("should execute no callback if missing", () => {
			document.execCommand = jest.fn();

			const onSuccess = jest.fn();

			const { getByTestId } = render(
				<Clipboard>
					<span>Hello!</span>
				</Clipboard>,
			);

			fireEvent.click(getByTestId("clipboard__inner"));

			expect(onSuccess).not.toHaveBeenCalled();
		});
	});

	describe("on error", () => {
		beforeAll(() => {
			document.execCommand = jest.fn().mockImplementation(() => {
				throw new Error();
			});
		});

		afterAll(() => {
			document.execCommand.mockRestore();
		});

		it("should execute the onError callback if given", () => {
			const onError = jest.fn();

			const { getByTestId } = render(
				<Clipboard onError={onError}>
					<span>Hello!</span>
				</Clipboard>,
			);

			fireEvent.click(getByTestId("clipboard__inner"));

			expect(onError).toHaveBeenCalled();
		});

		it("should execute no callback if missing", () => {
			const onError = jest.fn();

			const { getByTestId } = render(
				<Clipboard>
					<span>Hello!</span>
				</Clipboard>,
			);

			fireEvent.click(getByTestId("clipboard__inner"));

			expect(onError).not.toHaveBeenCalled();
		});
	});
});
