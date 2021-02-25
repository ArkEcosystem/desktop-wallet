/* eslint-disable @typescript-eslint/require-await */
import React from "react";
import { act, fireEvent, render } from "testing-library";

import { Modal } from "./Modal";
import { modalOffsetClass } from "./utils";

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

	it("should closed by the Esc key", async () => {
		const onClose = jest.fn();
		const { asFragment, getByTestId } = render(<Modal title="ark" isOpen={true} onClose={onClose} />);

		expect(getByTestId("modal__overlay")).toBeTruthy();

		act(() => {
			fireEvent.keyUp(getByTestId("modal__inner"), { key: "Enter", code: 13 });
		});

		act(() => {
			fireEvent.keyUp(getByTestId("modal__inner"), { key: "Escape", code: 27 });
		});

		expect(onClose).toHaveBeenCalledTimes(1);
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

	it("should render a 3x large one", () => {
		const { container } = render(<Modal title="ark" size="3xl" isOpen={true} />);

		expect(container).toMatchSnapshot();
	});

	it("should render a 4x large one", () => {
		const { container } = render(<Modal title="ark" size="4xl" isOpen={true} />);

		expect(container).toMatchSnapshot();
	});

	it("should render a 5x large one", () => {
		const { container } = render(<Modal title="ark" size="5xl" isOpen={true} />);

		expect(container).toMatchSnapshot();
	});

	it("should render a 5x large one", () => {
		const { container } = render(<Modal title="ark" size="5xl" isOpen={true} />);

		expect(container).toMatchSnapshot();
	});

	it("should not add top offset class if padded modal content fits in window height", () => {
		const modalHeightMock = 400;
		const windowHeightMock = 1000;
		const topOffsetClass = modalOffsetClass(modalHeightMock, windowHeightMock);
		expect(topOffsetClass).toBe("");
	});

	it("should add top offset class if padded modal content is higher than window height", () => {
		const modalHeightMock = 975;
		const windowHeightMock = 1000;
		const topOffsetClass = modalOffsetClass(modalHeightMock, windowHeightMock);
		expect(topOffsetClass).toBe("top-0 my-20");
	});

	it("should render a modal with banner", () => {
		const { asFragment, getByTestId } = render(
			<Modal title="ark" isOpen={true} banner={true}>
				This is the Modal content
			</Modal>,
		);

		expect(getByTestId("modal__overlay")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
