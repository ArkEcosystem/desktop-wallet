import React from "react";
import { act, fireEvent, render } from "testing-library";

import { TruncateMiddle } from "./TruncateMiddle";

describe("TruncateMiddle", () => {
	it("should truncate with default maxChars", () => {
		const { container } = render(<TruncateMiddle text="ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT" />);
		expect(container).toHaveTextContent("ASuusX…GQ3kqT");
	});

	it("should truncate with custom maxChars", () => {
		const { container } = render(<TruncateMiddle text="ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT" maxChars={28} />);
		expect(container).toHaveTextContent("ASuusXSW9kfW…ttP6T9GQ3kqT");
	});

	it("should not truncate if string is less than maxChars", () => {
		const { container } = render(<TruncateMiddle text="1234" />);
		expect(container).toHaveTextContent("1234");
	});

	it("should show tooltip", () => {
		const { getByTestId, baseElement } = render(<TruncateMiddle text="ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT" />);

		act(() => {
			fireEvent.mouseEnter(getByTestId("TruncateMiddle"));
		});

		expect(baseElement).toHaveTextContent("ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT");
	});
});
