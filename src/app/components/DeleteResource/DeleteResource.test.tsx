import React from "react";
import { render } from "testing-library";

import { DeleteResource } from "./DeleteResource";

describe("DeleteWallet", () => {
	const onDelete = jest.fn();

	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<DeleteResource isOpen={false} onDelete={onDelete} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with children", () => {
		const { asFragment, getByTestId } = render(
			<DeleteResource isOpen={true} onDelete={onDelete}>
				<span>Hello!</span>
			</DeleteResource>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent("Hello!");
		expect(asFragment()).toMatchSnapshot();
	});
});
