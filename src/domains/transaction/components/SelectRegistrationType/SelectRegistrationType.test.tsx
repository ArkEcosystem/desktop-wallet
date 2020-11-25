import { Enums } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { act, fireEvent, render, waitFor } from "utils/testing-library";

import { SelectRegistrationType } from "./SelectRegistrationType";

const registrationTypes = [
	{
		value: "entityRegistration",
		type: Enums.EntityType.Business,
		label: "Business",
	},
	{
		value: "entityRegistration",
		type: Enums.EntityType.Product,
		label: "Product",
	},
	{
		value: "entityRegistration",
		type: Enums.EntityType.Plugin,
		label: "Plugin",
	},
	{
		value: "multiSignature",
		label: "MultiSignature",
	},
	{
		value: "secondSignature",
		label: "Second Signature",
	},
];

describe("SelectRegistrationType", () => {
	it("should render", () => {
		const { container } = render(<SelectRegistrationType />);
		expect(container).toMatchSnapshot();
	});

	it("should render with registration types", () => {
		const { container } = render(<SelectRegistrationType options={registrationTypes} />);
		expect(container).toMatchSnapshot();
	});

	it("should show typeahead when typing has found at least one match", () => {
		const { getByTestId } = render(<SelectRegistrationType options={registrationTypes} />);
		const input = getByTestId("SelectRegistrationTypeInput__input");

		act(() => {
			fireEvent.change(input, { target: { value: "Busin" } });
		});

		expect(getByTestId("SelectRegistrationTypeInput__typeahead")).toHaveTextContent("Business");
	});

	it("should select first matching registration type with enter", () => {
		const { getByTestId } = render(<SelectRegistrationType options={registrationTypes} />);
		const input = getByTestId("SelectRegistrationTypeInput__input");

		act(() => {
			fireEvent.change(input, { target: { value: "Busin" } });
		});

		act(() => {
			fireEvent.keyDown(input, { key: "Enter", code: 13 });
		});

		expect(getByTestId("SelectRegistrationTypeInput__typeahead")).toHaveTextContent("Business");
	});

	it("should select first matching registration type with tab", () => {
		const { getByTestId } = render(<SelectRegistrationType options={registrationTypes} />);
		const input = getByTestId("SelectRegistrationTypeInput__input");

		act(() => {
			fireEvent.change(input, { target: { value: "Busin" } });
		});

		act(() => {
			fireEvent.keyDown(input, { key: "Tab", code: 9 });
		});

		expect(getByTestId("SelectRegistrationTypeInput__typeahead")).toHaveTextContent("Business");
	});

	it("should not select non-matching registration type after key input and tab", () => {
		const { getByTestId } = render(<SelectRegistrationType options={registrationTypes} />);
		const input = getByTestId("SelectRegistrationTypeInput__input");

		act(() => {
			fireEvent.change(input, { target: { value: "Bot" } });
		});

		act(() => {
			fireEvent.keyDown(input, { key: "Tab", code: 9 });
		});

		expect(input).toHaveValue("Bot");
	});

	it("should clear selection when changing input", () => {
		const { getByTestId } = render(<SelectRegistrationType options={registrationTypes} />);
		const input = getByTestId("SelectRegistrationTypeInput__input");

		act(() => {
			fireEvent.change(input, { target: { value: "MultiSignature" } });
		});

		act(() => {
			fireEvent.keyDown(input, { key: "Enter", code: 13 });
		});

		expect(getByTestId("SelectRegistrationTypeInput__typeahead")).toHaveTextContent("MultiSignature");

		act(() => {
			fireEvent.change(input, { target: { value: "test" } });
		});

		act(() => {
			fireEvent.keyDown(input, { key: "A", code: 65 });
		});
		act(() => {
			fireEvent.keyDown(input, { key: "B", code: 65 });
		});

		expect(getByTestId("SelectRegistrationTypeInput__input")).toHaveValue("");
	});

	it("should select match on blur if available", async () => {
		const { getByTestId } = render(<SelectRegistrationType options={registrationTypes} />);
		const input = getByTestId("SelectRegistrationTypeInput__input");

		act(() => {
			fireEvent.change(input, { target: { value: "Second Signature" } });
		});

		act(() => {
			fireEvent.blur(input);
		});

		await waitFor(() => expect(input).toHaveValue("Second Signature"));
	});

	it("should clear input on blur if there is no match", async () => {
		const { getByTestId } = render(<SelectRegistrationType options={registrationTypes} />);
		const input = getByTestId("SelectRegistrationTypeInput__input");

		act(() => {
			fireEvent.change(input, { target: { value: "Foobar" } });
		});

		act(() => {
			fireEvent.blur(input);
		});

		await waitFor(() => expect(input).toHaveValue(""));
	});

	it("should not clear input on blur if selected", () => {
		const { getByTestId } = render(<SelectRegistrationType options={registrationTypes} />);
		const input = getByTestId("SelectRegistrationTypeInput__input");

		act(() => {
			fireEvent.change(input, { target: { value: "Busin" } });
		});

		act(() => {
			fireEvent.keyDown(input, { key: "Enter", code: 13 });
		});

		expect(input).toHaveValue("Business");

		act(() => {
			fireEvent.blur(input);
		});

		expect(input).toHaveValue("Business");
	});

	it("should select an item by clicking on it", async () => {
		const { getByTestId } = render(<SelectRegistrationType options={registrationTypes} />);

		act(() => {
			fireEvent.focus(getByTestId("SelectRegistrationTypeInput__input"));
		});

		await waitFor(() => expect(getByTestId("RegistrationTypeIcon-Business")).toBeTruthy());

		act(() => {
			fireEvent.mouseDown(getByTestId("RegistrationTypeIcon-Business"));
		});

		expect(getByTestId("SelectRegistrationTypeInput__typeahead")).toHaveTextContent("Business");
	});

	it("should toggle selection by clicking on registration type icon", async () => {
		const { getByTestId } = render(
			<SelectRegistrationType options={registrationTypes} selected={registrationTypes[0]} />,
		);

		act(() => {
			fireEvent.focus(getByTestId("SelectRegistrationTypeInput__input"));
		});

		await waitFor(() => expect(getByTestId("RegistrationTypeIcon-Business")).toBeTruthy());

		act(() => {
			fireEvent.mouseDown(getByTestId("RegistrationTypeIcon-Business"));
		});

		await waitFor(() =>
			expect(getByTestId("SelectRegistrationTypeInput__typeahead")).toHaveTextContent("Business"),
		);
	});
});
