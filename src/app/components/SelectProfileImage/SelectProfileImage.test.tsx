import React from "react";
import { render } from "testing-library";

import { SelectProfileImage } from "./SelectProfileImage";

describe("SelectProfileImage", () => {
	it("should render", () => {
		const onSelect = jest.fn();

		const { container } = render(<SelectProfileImage onSelect={onSelect} />);

		expect(container).toMatchSnapshot();
	});
});
