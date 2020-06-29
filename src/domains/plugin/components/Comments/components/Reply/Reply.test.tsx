import { render } from "@testing-library/react";
import MockDate from "mockdate";
import React from "react";

import { Reply } from "./Reply";

beforeEach(() => MockDate.set(new Date("2020-06-22T14:48:00.000Z")));

afterEach(() => MockDate.reset());

describe("Reply", () => {
	it("should render properly", () => {
		const date = "2020-06-19T14:48:00.000Z";
		const content = "<a href='#'>@Gerard Blezer</a> Our GitHub bount reward program utlilizes a tiered structure.";

		const { asFragment } = render(<Reply date={date} content={content} />);

		expect(asFragment()).toMatchSnapshot();
	});
});
