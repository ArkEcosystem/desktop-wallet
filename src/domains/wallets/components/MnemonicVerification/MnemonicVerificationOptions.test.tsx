import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MnemonicVerificationOptions } from "./MnemonicVerificationOptions";

describe("MnemonicVerificationOptions", () => {
	const options = ["a", "b", "c", "d"];
	const answer = "b";
	const limit = 2;

	it("should render options", () => {
		const handleChange = jest.fn();
		const { getAllByTestId } = render(
			<MnemonicVerificationOptions
				handleChange={handleChange}
				options={options}
				answer={answer}
				limit={limit}
				position={1}
			/>,
		);
		const buttons = getAllByTestId("MnemonicVerificationOptions__button");
		expect(buttons.length).toEqual(limit);
	});

	it("should call handle on click", () => {
		const handleChange = jest.fn();
		const { getByText } = render(
			<MnemonicVerificationOptions
				handleChange={handleChange}
				options={options}
				answer={answer}
				limit={limit}
				position={1}
			/>,
		);
		fireEvent.click(getByText(answer));
		expect(handleChange).toHaveBeenCalledWith(answer);
	});
});
