import electron from "electron";
import React from "react";
import { act, fireEvent, render, waitFor } from "utils/testing-library";

import { SelectFile } from "./SelectFile";

jest.mock("fs", () => ({
	writeFileSync: jest.fn(),
	readFileSync: jest.fn().mockReturnValue({ toString: () => "{test:'test'}" }),
}));

describe("SelectFile", () => {
	it("should render", () => {
		const { container } = render(<SelectFile />);
		expect(container).toMatchSnapshot();
	});

	it("should render with dwe file format", () => {
		const { container } = render(<SelectFile fileFormat=".dwe" />);
		expect(container).toMatchSnapshot();
	});

	it("should render with json file format", () => {
		const { container } = render(<SelectFile fileFormat=".json" />);
		expect(container).toMatchSnapshot();
	});

	it("should open dialog to select file", async () => {
		//@ts-ignore
		const showOpenDialogMock = jest.spyOn(electron.remote.dialog, "showOpenDialog").mockImplementation(() => ({
			filePaths: ["filePath"],
		}));

		const onSelect = jest.fn();
		const { getByTestId } = render(<SelectFile fileFormat=".json" onSelect={onSelect} />);
		act(() => {
			fireEvent.click(getByTestId("SelectFile__browse-files"));
		});

		expect(showOpenDialogMock).toHaveBeenCalledWith({
			filters: [{ extensions: ["json"], name: "" }],
			properties: ["openFile"],
		});

		await waitFor(() => expect(onSelect).toHaveBeenCalled());
		showOpenDialogMock.mockRestore();
	});

	it("should handle file drop", async () => {
		//@ts-ignore
		const onSelect = jest.fn();
		const { getByTestId } = render(<SelectFile fileFormat=".json" onSelect={onSelect} />);

		act(() => {
			fireEvent.dragOver(getByTestId("SelectFile__browse-files"), {
				dataTransfer: {
					files: [{ name: "sample-export.json", path: "path/to/sample-export/json" }],
				},
			});
		});

		act(() => {
			fireEvent.dragEnter(getByTestId("SelectFile__browse-files"), {
				dataTransfer: {
					files: [{ name: "sample-export.json", path: "path/to/sample-export/json" }],
				},
			});
		});

		act(() => {
			fireEvent.drop(getByTestId("SelectFile__browse-files"), {
				dataTransfer: {
					files: [{ name: "sample-export.json", path: "path/to/sample-export/json" }],
				},
			});
		});

		await waitFor(() => expect(onSelect).toHaveBeenCalled());

		act(() => {
			fireEvent.drop(getByTestId("SelectFile__browse-files"), {
				dataTransfer: {
					files: [],
				},
			});
		});
		await waitFor(() => expect(onSelect).toHaveBeenCalledTimes(1));
	});
});
