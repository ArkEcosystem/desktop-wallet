/* eslint-disable @typescript-eslint/require-await */
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { act, fireEvent, getDefaultProfileId, renderWithRouter, waitFor } from "testing-library";

import { ContactUs } from "./ContactUs";

const history = createMemoryHistory();

const supportURL = `/profiles/${getDefaultProfileId()}/support`;

describe("ContactUs", () => {
	beforeAll(() => {
		history.push(supportURL);
	});

	it("should render", () => {
		const { container } = renderWithRouter(
			<Route path="/profiles/:profileId/support">
				<ContactUs />
			</Route>,
			{
				routes: [supportURL],
				history,
			},
		);

		expect(container).toMatchSnapshot();
	});

	it("should fill the contact form", async () => {
		const consoleMock = jest.spyOn(console, "log").mockImplementation();

		const { container, getAllByTestId, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/support">
				<ContactUs />
			</Route>,
			{
				routes: [supportURL],
				history,
			},
		);

		// Trigger field errors
		await act(async () => {
			fireEvent.click(getByTestId("ContactForm__submit-button"));
		});

		// Name
		fireEvent.input(getAllByTestId("Input")[0], { target: { value: "Name" } });

		// Email
		fireEvent.input(getAllByTestId("Input")[1], { target: { value: "name@email.com" } });

		// Subject
		await act(async () => {
			fireEvent.focus(getByTestId("SelectDropdownInput__input"));
		});

		fireEvent.click(getByTestId("select-list__toggle-option-0"));

		// Message
		fireEvent.input(getAllByTestId("TextArea")[0], { target: { value: "Message" } });

		await act(async () => {
			fireEvent.click(getByTestId("ContactForm__submit-button"));
		});

		await waitFor(() => expect(consoleMock).toHaveBeenCalledTimes(1));

		expect(container).toMatchSnapshot();

		consoleMock.mockRestore();
	});
});
