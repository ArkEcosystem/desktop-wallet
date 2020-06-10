import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { act } from "@testing-library/react-hooks";

import { SelectNetwork } from "../SelectNetwork";

describe("SelectNetwork", () => {
	const networks = [
		{
			name: "ark",
			isSelected: false,
		},
		{
			name: "eth",
			isSelected: true,
		},
		{
			name: "btc",
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

	it("should call onSelect callback upon change", () => {
		const onSelect = jest.fn();
		const { getByTestId } = render(<SelectNetwork networks={networks} onSelect={onSelect}></SelectNetwork>);
		const firstNetwork = getByTestId("network__option--0");

		act(() => {
			fireEvent.click(firstNetwork);
		});

		expect(onSelect).toBeCalled();
	});

	it("should ignore onSelect callback upon selection if not provided", () => {
		const onSelect = jest.fn();
		const { getByTestId } = render(<SelectNetwork networks={networks}></SelectNetwork>);
		const firstNetwork = getByTestId("network__option--0");

		act(() => {
			fireEvent.click(firstNetwork);
		});

		expect(onSelect).not.toHaveBeenCalled();
	});
});
