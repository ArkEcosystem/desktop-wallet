import { SelectFileStep } from "domains/profile/pages/ImportProfile/SelectFileStep";
import React from "react";
import { act, fireEvent, render } from "utils/testing-library";

jest.mock("fs", () => ({
	writeFileSync: jest.fn(),
	readFileSync: jest.fn().mockReturnValue({ toString: () => "{test:'test'}" }),
}));

describe("Import Profile Select File Step", () => {
	it("should render with dwe fileFormat selected", () => {
		const { container } = render(<SelectFileStep fileFormat=".dwe" />);
		expect(container).toMatchSnapshot();
	});

	it("should render with json fileFormat selected", () => {
		const { container } = render(<SelectFileStep fileFormat=".json" />);
		expect(container).toMatchSnapshot();
	});

	it("should render file selection for dwe and switch to json", () => {
		const onFileFormatChange = jest.fn();
		const { container, getByTestId } = render(
			<SelectFileStep fileFormat=".dwe" onFileFormatChange={onFileFormatChange} />,
		);

		act(() => {
			fireEvent.click(getByTestId("SelectFileStep__change-file"));
		});

		expect(onFileFormatChange).toHaveBeenCalled();
		expect(container).toMatchSnapshot();
	});

	it("should handle back event", () => {
		const onBack = jest.fn();
		const { container, getByTestId } = render(<SelectFileStep fileFormat=".dwe" onBack={onBack} />);

		act(() => {
			fireEvent.click(getByTestId("SelectFileStep__back"));
		});

		expect(onBack).toHaveBeenCalled();
		expect(container).toMatchSnapshot();
	});

	it("should change back from json to dwe", () => {
		const onFileFormatChange = jest.fn();
		const { container, getByTestId } = render(
			<SelectFileStep fileFormat=".json" onFileFormatChange={onFileFormatChange} />,
		);

		act(() => {
			fireEvent.click(getByTestId("SelectFileStep__back"));
		});

		expect(onFileFormatChange).toHaveBeenCalled();
		expect(container).toMatchSnapshot();
	});
});
