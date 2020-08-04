import React from "react";
import { render } from "testing-library";

import { SubForm } from "./SubForm";

describe("SubForm", () => {
	it("should render", () => {
		const { asFragment } = render(
			<SubForm>
				<span>Hello</span>
			</SubForm>,
		);

		expect(asFragment()).toMatchSnapshot();
	});
});
