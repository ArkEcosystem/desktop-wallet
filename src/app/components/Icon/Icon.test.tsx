import React from "react";
import { render } from "test-utils";

import { Icon } from "./Icon";

describe("Icon", () => {
	it("should render", () => {
		const { container, asFragment } = render(<Icon name="Ark" />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
