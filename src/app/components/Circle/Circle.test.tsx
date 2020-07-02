import React from "react";
import { render } from "testing-library";

import { Circle } from "./Circle";

describe("Circle", () => {
	it("should render", () => {
		const { container } = render(<Circle />);
		expect(container).toMatchSnapshot();
	});

	it("should render as blank", () => {
		const { container } = render(<Circle />);
		expect(container).toMatchSnapshot();
	});

	it("should render with content", () => {
		const { container } = render(
			<Circle size="sm">
				<div data-testid="circle__content" />
			</Circle>,
		);
		expect(container).toMatchSnapshot();
	});

	it("should render as avatar", () => {
		const { container } = render(<Circle avatarId="test" />);
		expect(container).toMatchSnapshot();
	});

	it("should render small", () => {
		const { container } = render(<Circle size="sm" />);

		expect(container).toMatchSnapshot();
	});

	it("should render large", () => {
		const { container } = render(<Circle size="lg" />);

		expect(container).toMatchSnapshot();
	});

	it("should render extra-large", () => {
		const { container } = render(<Circle size="xl" />);

		expect(container).toMatchSnapshot();
	});

	it("should render with no shadow", () => {
		const { container } = render(<Circle size="sm" noShadow />);

		expect(container).toMatchSnapshot();
	});
});
