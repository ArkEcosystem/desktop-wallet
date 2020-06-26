import { render } from "@testing-library/react";
import React from "react";
jest.mock("moment", () => {
	return () => jest.requireActual("moment")("2020-06-19T14:48:00.000Z");
});

import { Reply } from "./Reply";

describe("Reply", () => {
	it("should render properly", () => {
		const date = "2020-06-19T14:48:00.000Z";
		const content = "<a href='#'>@Gerard Blezer</a> Our GitHub bount reward program utlilizes a tiered structure.";

		const { asFragment } = render(<Reply date={date} content={content} />);

		expect(asFragment()).toMatchSnapshot();
	});
});
