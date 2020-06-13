import React from "react";
import { render } from "@testing-library/react";
// import { act } from "@testing-library/react-hooks";

import { Circle } from "../Circle";

describe("Circle", () => {
	it("should render", () => {
		const { container } = render(<Circle></Circle>);
		expect(container).toMatchSnapshot();
	});

	it("should render as blank", () => {
		const { container } = render(<Circle />);
		expect(container).toMatchSnapshot();
	});

	it("should render with content", () => {
		const { container } = render(
			<Circle size="small">
				<div data-testid="circle__content"></div>
			</Circle>,
		);
		expect(container).toMatchSnapshot();
	});

	it("should render as avatar", () => {
		const { container } = render(<Circle avatarId="test" />);
		expect(container).toMatchSnapshot();
	});

	it("should render small", () => {
		const { container } = render(<Circle size="small" />);

		expect(container).toMatchSnapshot();
	});

	it("should render with no shadow", () => {
		const { container } = render(<Circle size="small" noShadow />);

		expect(container).toMatchSnapshot();
	});
});
