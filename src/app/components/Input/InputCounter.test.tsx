import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { InputCounter } from "./InputCounter";

describe("InputCounter", () => {
	it("should render", () => {
		const { getByTestId, asFragment } = render(<InputCounter maxLength={10} />);
		expect(getByTestId("InputCounter__counter")).toHaveTextContent("0/10");
		expect(getByTestId("InputCounter__input")).toHaveAttribute("maxLength", "10");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with default value", () => {
		const { getByTestId } = render(<InputCounter maxLength={10} defaultValue="Hello" />);
		expect(getByTestId("InputCounter__counter")).toHaveTextContent("5/10");
	});

	it("should update the length when changing the value", () => {
		const { getByTestId } = render(<InputCounter maxLength={10} />);
		fireEvent.input(getByTestId("InputCounter__input"), { target: { value: "Test" } });
		expect(getByTestId("InputCounter__counter")).toHaveTextContent("4/10");
	});
});
