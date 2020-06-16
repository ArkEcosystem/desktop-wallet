import { render } from "@testing-library/react";
import React from "react";

import { Icon } from "./Icon";

describe("Icon", () => {
	it("should render", () => {
		const { container, asFragment } = render(<Icon name="Ark" />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
