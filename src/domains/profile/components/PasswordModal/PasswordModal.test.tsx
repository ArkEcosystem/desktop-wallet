/* eslint-disable @typescript-eslint/require-await */
import React from "react";
import { act, fireEvent, renderWithRouter, waitFor } from "utils/testing-library";

import { PasswordModal } from "./PasswordModal";

describe("PasswordModal", () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	it("should not render if not open", () => {
		const { asFragment, getByTestId } = renderWithRouter(<PasswordModal isOpen={false} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with title and description", async () => {
		let renderContext: any;

		await act(async () => {
			renderContext = renderWithRouter(
				<PasswordModal isOpen={true} title="Password title" description="Password description" />,
			);
		});

		const { asFragment, getByTestId } = renderContext;

		expect(getByTestId("modal__inner")).toHaveTextContent("Password title");
		expect(getByTestId("modal__inner")).toHaveTextContent("Password description");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should cancel", async () => {
		const onCancel = jest.fn();

		const { getByTestId } = renderWithRouter(<PasswordModal isOpen={true} onCancel={onCancel} />);

		act(() => {
			fireEvent.click(getByTestId("PasswordModal__cancel-button"));
		});

		await waitFor(() => {
			expect(onCancel).toBeCalled();
		});
	});

	it("should submit", async () => {
		const onSuccess = jest.fn();

		const { findByTestId, getByTestId } = renderWithRouter(<PasswordModal isOpen={true} onSubmit={onSuccess} />);

		await act(async () => {
			fireEvent.input(getByTestId("PasswordModal__input"), { target: { value: "password" } });
		});

		// wait for formState.isValid to be updated
		await findByTestId("PasswordModal__submit-button");

		act(() => {
			fireEvent.click(getByTestId("PasswordModal__submit-button"));
		});

		await waitFor(() => {
			expect(onSuccess).toBeCalled();
		});
	});
});
