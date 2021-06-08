import React, { useRef } from "react";
import { render, screen } from "utils/testing-library";

import { useTextTruncate } from "./use-text-truncate";

let referenceElement: any;

const value = "Lorem ipsum dolor sit amet consectetur adipisicing elit.";

const Component = ({ value }: any) => {
	referenceElement = useRef(null);

	const truncated = useTextTruncate(referenceElement?.current, value);

	return (
		<div ref={referenceElement} className="inline-flex overflow-hidden">
			{truncated}
		</div>
	);
};

describe("useTextTruncate", () => {
	beforeEach(() => {
		referenceElement = undefined;
	});

	it("should return the value if the elements have no width", () => {
		const { asFragment, rerender } = render(<Component value={value} />);

		expect(screen.getByText(value)).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();

		const widthSpy = jest.spyOn(referenceElement.current, "offsetWidth", "get").mockReturnValue(0);

		const element = document.createElement("span");

		// offsetWidth is read twice for each overflow check
		const elementSpy = jest.spyOn(element, "offsetWidth", "get").mockReturnValueOnce(0).mockReturnValueOnce(0);

		const documentSpy = jest.spyOn(document, "createElement").mockReturnValue(element);

		rerender(<Component value={value} />);

		expect(screen.getByText(value)).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();

		widthSpy.mockRestore();
		documentSpy.mockRestore();
		elementSpy.mockRestore();
	});

	it("should return the value if it fits the given container", () => {
		const { asFragment, rerender } = render(<Component value={value} />);

		expect(screen.getByText(value)).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();

		const widthSpy = jest.spyOn(referenceElement.current, "offsetWidth", "get").mockReturnValue(100);

		const element = document.createElement("span");

		// offsetWidth is read twice for each overflow check
		const elementSpy = jest.spyOn(element, "offsetWidth", "get").mockReturnValueOnce(50).mockReturnValueOnce(50);

		const documentSpy = jest.spyOn(document, "createElement").mockReturnValue(element);

		rerender(<Component value={value} />);

		expect(screen.getByText(value)).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();

		widthSpy.mockRestore();
		documentSpy.mockRestore();
		elementSpy.mockRestore();
	});

	it("should truncate the value if it does not fit the given container", () => {
		const { asFragment, rerender } = render(<Component value={value} />);

		expect(screen.getByText(value)).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();

		const widthSpy = jest.spyOn(referenceElement.current, "offsetWidth", "get").mockReturnValue(50);

		const element = document.createElement("span");

		// offsetWidth is read twice for each overflow check
		const elementSpy = jest
			.spyOn(element, "offsetWidth", "get")
			.mockReturnValueOnce(100)
			.mockReturnValueOnce(100)
			.mockReturnValueOnce(90)
			.mockReturnValueOnce(90)
			.mockReturnValueOnce(50)
			.mockReturnValueOnce(50);

		const documentSpy = jest.spyOn(document, "createElement").mockReturnValue(element);

		rerender(<Component value={value} />);

		expect(screen.getByText("Lorem ipsum dolor sit amet…sectetur adipisicing elit.")).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();

		widthSpy.mockRestore();
		documentSpy.mockRestore();
		elementSpy.mockRestore();
	});
});
