import React from "react";
import { render } from "testing-library";

import { SearchResource } from "./SearchResource";

describe("SearchResource", () => {
	const onClose = jest.fn();

	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<SearchResource title="Title" isOpen={false} onClose={onClose} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with children", () => {
		const { asFragment, getByTestId } = render(
			<SearchResource title="Title" isOpen={true} onClose={onClose}>
				<span>Hello!</span>
			</SearchResource>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent("Hello!");
		expect(asFragment()).toMatchSnapshot();
	});
});
