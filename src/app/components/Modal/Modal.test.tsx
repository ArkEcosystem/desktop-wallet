/* eslint-disable @typescript-eslint/require-await */
import React from "react";
import { act, fireEvent, render, screen } from "testing-library";

import { Modal } from "./Modal";

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

	it("should closed by click on overlay", () => {
		const onClose = jest.fn();
		render(
			<Modal title="ark" isOpen={true} onClose={onClose}>
				This is the Modal content
			</Modal>,
		);

		expect(screen.getByTestId("modal__overlay")).toBeInTheDocument();
		expect(screen.getByTestId("modal__inner")).toBeInTheDocument();

		act(() => {
			fireEvent.click(screen.getByTestId("modal__overlay"));
		});

		expect(onClose).toBeCalled();
	});

	it("should no close by click on modal content", () => {
		const onClose = jest.fn();
		render(
			<Modal title="ark" isOpen={true} onClose={onClose}>
				This is the Modal content
			</Modal>,
		);

		expect(screen.getByTestId("modal__overlay")).toBeInTheDocument();
		expect(screen.getByTestId("modal__inner")).toBeInTheDocument();

		act(() => {
			fireEvent.click(screen.getByTestId("modal__inner"));
		});

		expect(onClose).not.toBeCalled();
	});

	it("should closed by the Esc key", async () => {
		const onClose = jest.fn();
		const { asFragment, getByTestId } = render(<Modal title="ark" isOpen={true} onClose={onClose} />);

		expect(getByTestId("modal__overlay")).toBeTruthy();

		act(() => {
			fireEvent.keyUp(getByTestId("modal__inner"), { code: 13, key: "Enter" });
		});

		act(() => {
			fireEvent.keyUp(getByTestId("modal__inner"), { code: 27, key: "Escape" });
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
