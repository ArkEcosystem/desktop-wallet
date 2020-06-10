import React from "react";
import { render } from "@testing-library/react";

import { ProfileCreated } from "../";

describe("ContactUs", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<ProfileCreated isOpen={false} onSend={() => void 0} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment } = render(<ProfileCreated isOpen={true} onSend={() => void 0} />);

		expect(asFragment()).toMatchSnapshot();
	});
});
