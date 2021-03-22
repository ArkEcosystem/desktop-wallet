import { act, renderHook } from "@testing-library/react-hooks";
import electron from "electron";

import { useFiles } from "./use-files";

jest.mock("fs", () => ({
	writeFileSync: jest.fn(),
	readFileSync: jest.fn().mockReturnValue({ toString: () => "{test:'test'}" }),
}));

describe("useFiles", () => {
	it("should read file contents", () => {
		const { result } = renderHook(() => useFiles());
		expect(result.current.readFileContents("/path/to/file.json")).toEqual({
			content: "{test:'test'}",
			extension: ".json",
			name: "file.json",
		});
	});

	it("should open file", () => {
		//@ts-ignore
		const showOpenDialogMock = jest.spyOn(electron.remote.dialog, "showOpenDialog").mockImplementation(() => ({
			filePaths: ["filePath"],
		}));

		const { result } = renderHook(() => useFiles());

		act(() => {
			result.current.openFile({ extensions: ["json"] });
		});

		expect(showOpenDialogMock).toHaveBeenCalledWith({
			filters: [{ extensions: ["json"], name: "" }],
			properties: ["openFile"],
		});

		//@ts-ignore
		const showOpenDialogEmptyFilesMock = jest
			.spyOn(electron.remote.dialog, "showOpenDialog")
			.mockImplementation(() => ({
				filePaths: [],
			}));

		act(() => {
			result.current.openFile({ extensions: ["json"] });
		});

		expect(showOpenDialogMock).toHaveBeenCalledWith({
			filters: [{ extensions: ["json"], name: "" }],
			properties: ["openFile"],
		});

		showOpenDialogMock.mockRestore();
		showOpenDialogEmptyFilesMock.mockRestore();
	});
});
