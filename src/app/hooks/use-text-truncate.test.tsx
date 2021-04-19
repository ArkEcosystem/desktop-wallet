import React, { useRef } from "react";
import { render, screen } from "utils/testing-library";

import { useTextTruncate } from "./use-text-truncate";

describe("UseTextTruncate", () => {
	it("should truncate the text if it is longer than the parent", () => {
		let parentRef: any;
		let truncateRef: any;

		const Component = ({ minChars }: any) => {
			parentRef = useRef(null);
			const [TruncatedText, ref] = useTextTruncate({ text: "Lorem ipsum dolor sit amet", parentRef, minChars });
			truncateRef = ref;

			return (
				<div ref={parentRef} className="w-2">
					<TruncatedText />
				</div>
			);
		};

		const { rerender } = render(<Component minChars={5} />);

		expect(screen.getByText("Lorem ipsum dolor sit amet")).toBeInTheDocument();

		jest.spyOn(parentRef.current, "offsetWidth", "get").mockReturnValue(120);
		jest.spyOn(truncateRef.current, "offsetWidth", "get").mockReturnValue(150);

		rerender(<Component />);

		expect(screen.getByText("Lorem ip…sit amet")).toBeInTheDocument();

		jest.spyOn(truncateRef.current, "offsetWidth", "get").mockReturnValue(60);
		rerender(<Component minChars={8} />);

		expect(screen.getByText("Lorem ip…sit amet")).toBeInTheDocument();
	});
});
