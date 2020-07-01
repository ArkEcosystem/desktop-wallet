import React from "react";
import { render } from "test-utils";

import { Range } from "./Range";

describe("Range", () => {
	it("should render", () => {
		const onChange = jest.fn();
		const { getByTestId, asFragment } = render(<Range values={[10]} onChange={onChange} />);
		expect(getByTestId("Range")).toBeTruthy();
		expect(getByTestId("Range__track")).toBeTruthy();
		expect(getByTestId("Range__track__filled")).toBeTruthy();
		expect(getByTestId("Range__thumb")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
