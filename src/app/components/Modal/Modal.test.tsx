import { render } from "@testing-library/react";
import React from "react";

import { Modal } from "./";

describe("Modal", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<Modal title="ark" isOpen={false} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal with overlay", () => {
		const { asFragment, getByTestId } = render(
			<Modal title="ark" isOpen={true}>
				This is the Modal content
			</Modal>,
		);

		expect(getByTestId("modal__overlay")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal with description", () => {
		const { asFragment, getByTestId } = render(
			<Modal title="ark" description="This is the Modal description" isOpen={true} />,
		);

		expect(asFragment()).toMatchSnapshot();
		expect(getByTestId("modal__inner")).toHaveTextContent("This is the Modal description");
	});

	it("should render a modal with content", () => {
		const { asFragment, getByTestId } = render(
			<Modal title="ark" isOpen={true}>
				This is the Modal content
			</Modal>,
		);

		expect(asFragment()).toMatchSnapshot();
		expect(getByTestId("modal__inner")).toHaveTextContent("This is the Modal content");
	});

	it("should render a small one", () => {
		const { container } = render(<Modal title="ark" size="sm" isOpen={true} />);

		expect(container).toMatchSnapshot();
	});

	it("should render a medium one", () => {
		const { container } = render(<Modal title="ark" size="md" isOpen={true} />);

		expect(container).toMatchSnapshot();
	});

	it("should render a large one", () => {
		const { container } = render(<Modal title="ark" size="lg" isOpen={true} />);

		expect(container).toMatchSnapshot();
	});

	it("should render a xlarge one", () => {
		const { container } = render(<Modal title="ark" size="xl" isOpen={true} />);

		expect(container).toMatchSnapshot();
	});
});
