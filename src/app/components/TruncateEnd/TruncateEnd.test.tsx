import React from "react";
import { act, fireEvent, render } from "testing-library";

import { TruncateEnd } from "./TruncateEnd";

describe("TruncateEnd", () => {
	it("should truncate with default maxChars", () => {
		const { container } = render(<TruncateEnd text="ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT" />);
		expect(container).toHaveTextContent("ASuusXSW9kfWnicS…");
	});

	it("should truncate with custom maxChars", () => {
		const { container } = render(<TruncateEnd text="ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT" maxChars={28} />);
		expect(container).toHaveTextContent("ASuusXSW9kfWnicScSgUTjttP6T9…");
	});

	it("should not truncate if string is less than maxChars", () => {
		const { container } = render(<TruncateEnd text="1234" />);
		expect(container).toHaveTextContent("1234");
	});

	it("should show tooltip", () => {
		const { getByTestId, baseElement } = render(<TruncateEnd text="ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT" />);

		act(() => {
			fireEvent.mouseEnter(getByTestId("TruncateEnd"));
		});

		expect(baseElement).toHaveTextContent("ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT");
	});
});
