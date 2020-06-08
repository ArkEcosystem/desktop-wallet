import React from "react";
import { render, fireEvent } from "@testing-library/react";

import { InputPasword, InputPassword } from "../InputPassword";

describe.only("InputPassword", () => {
	it("should render as a password field", () => {
        const { asFragment, getByTestId } = render(<InputPassword />);
        const input = getByTestId("Input");
        expect(input).toHaveAttribute("type", "password");
		expect(asFragment()).toMatchSnapshot();
    });

    it("should toggle the input type", () => {
        const { asFragment, getByTestId } = render(<InputPassword />);
        const input = getByTestId("Input");
        const toggle = getByTestId("InputPassword__toggle");
        fireEvent.click(toggle);
        expect(input).toHaveAttribute("type", "text");
        fireEvent.click(toggle);
        expect(input).toHaveAttribute("type", "password");
    });
});
