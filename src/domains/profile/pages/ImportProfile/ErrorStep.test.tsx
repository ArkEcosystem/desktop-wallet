import { ImportError } from "domains/profile/pages/ImportProfile/ErrorStep";
import React from "react";
import { act, fireEvent, render } from "utils/testing-library";

jest.mock("fs", () => ({
	writeFileSync: jest.fn(),
	readFileSync: jest.fn().mockReturnValue({ toString: () => "{test:'test'}" }),
}));

describe("Import Profile - Error Step", () => {
	const file = { content: "dfdf", extension: ".dwe", name: "filename" };

	it("should render", () => {
		const { container } = render(<ImportError file={file} />);
		expect(container).toMatchSnapshot();
	});

	it("should emit back event", () => {
		const onBack = jest.fn();
		const { getByTestId } = render(<ImportError file={file} onBack={onBack} />);
		act(() => {
			fireEvent.click(getByTestId("ImportError__back"));
		});

		expect(onBack).toHaveBeenCalled();
	});

	it("should emit retry event", () => {
		const onRetry = jest.fn();
		const { getByTestId } = render(<ImportError file={file} onRetry={onRetry} />);
		act(() => {
			fireEvent.click(getByTestId("ImportError__retry"));
		});

		expect(onRetry).toHaveBeenCalled();
	});
});
