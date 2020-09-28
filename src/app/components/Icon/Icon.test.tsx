import React from "react";
import { render } from "testing-library";

import { Icon } from "./Icon";

describe("Icon", () => {
	it("should render", () => {
		const { container, asFragment } = render(<Icon name="ARK" />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
