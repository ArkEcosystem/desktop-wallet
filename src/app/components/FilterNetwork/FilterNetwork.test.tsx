import { act } from "@testing-library/react-hooks";
import React from "react";
import { fireEvent, render } from "testing-library";

import { FilterNetwork } from "./FilterNetwork";

const networks = [
	{
		name: "ARK",
		isSelected: false,
	},
	{
		name: "Ethereum",
		isSelected: true,
	},
	{
		name: "Bitcoin",
		isSelected: false,
	},
];

describe("FilterNetwork", () => {
	it("should render", () => {
		const { container } = render(<FilterNetwork />);
		expect(container).toMatchSnapshot();
	});

	it("should render with icon", () => {
		const { container } = render(<FilterNetwork networks={networks} />);
		expect(container).toMatchSnapshot();
	});

	it("should call onChange callback upon change", () => {
		const onChange = jest.fn();
		const { getByTestId } = render(<FilterNetwork networks={networks} onChange={onChange} />);
		const firstNetwork = getByTestId("network__option--0");

		act(() => {
			fireEvent.click(firstNetwork);
		});

		expect(onChange).toBeCalled();
	});

	it("should ignore onChange callback upon selection if not provided", () => {
		const onChange = jest.fn();
		const { getByTestId } = render(<FilterNetwork networks={networks} />);
		const firstNetwork = getByTestId("network__option--0");

		act(() => {
			fireEvent.click(firstNetwork);
		});

		expect(onChange).not.toHaveBeenCalled();
	});

	it("should hide view all", () => {
		const { container } = render(<FilterNetwork networks={networks} hideViewAll />);
		expect(container).toMatchSnapshot();
	});
});
