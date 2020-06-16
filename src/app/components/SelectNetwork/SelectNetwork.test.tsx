import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { act } from "@testing-library/react-hooks";

import { SelectNetwork } from "./SelectNetwork";

describe("SelectNetwork", () => {
	const networks = [
		{
			name: "Ark",
			isSelected: false,
		},
		{
			name: "Eth",
			isSelected: true,
		},
		{
			name: "Btc",
			isSelected: false,
		},
	];

	it("should render", () => {
		const { container } = render(<SelectNetwork />);
		expect(container).toMatchSnapshot();
	});

	it("should render with icon", () => {
		const { container } = render(<SelectNetwork networks={networks} />);
		expect(container).toMatchSnapshot();
	});

	it("should call onChange callback upon change", () => {
		const onChange = jest.fn();
		const { getByTestId } = render(<SelectNetwork networks={networks} onChange={onChange}></SelectNetwork>);
		const firstNetwork = getByTestId("network__option--0");

		act(() => {
			fireEvent.click(firstNetwork);
		});

		expect(onChange).toBeCalled();
	});

	it("should ignore onChange callback upon selection if not provided", () => {
		const onChange = jest.fn();
		const { getByTestId } = render(<SelectNetwork networks={networks}></SelectNetwork>);
		const firstNetwork = getByTestId("network__option--0");

		act(() => {
			fireEvent.click(firstNetwork);
		});

		expect(onChange).not.toHaveBeenCalled();
	});
});
