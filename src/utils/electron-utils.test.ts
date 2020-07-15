import electron from "electron";

import { openFile, saveFile } from "./electron-utils";

jest.mock("electron", () => ({
	remote: {
		dialog: {
			showOpenDialog: jest.fn(),
			showSaveDialog: jest.fn(),
		},
	},
}));

jest.mock("fs", () => ({
	writeFileSync: jest.fn(),
	readFileSync: jest.fn(),
}));

const defaultFilters = [
	{ name: "JSON", extensions: ["json"] },
	{ name: "All Files", extensions: ["*"] },
];

describe("Electron utils", () => {
	let wrapper;

	describe("saveFile", () => {
		let showSaveDialogMock;

		beforeEach(() => {
			showSaveDialogMock = jest.spyOn(electron.remote.dialog, "showSaveDialog").mockImplementation(() => ({
				filePath: "filePath",
			}));
		});

		afterEach(() => {
			showSaveDialogMock.mockRestore();
		});

		it("should return early when the obtained filePath is falsy", async () => {
			showSaveDialogMock = jest.spyOn(electron.remote.dialog, "showSaveDialog").mockImplementation(() => ({
				filePath: undefined,
			}));

			await expect(saveFile()).resolves.toEqual(undefined);
		});

		describe("with filter parameter", () => {
			it("should parse a single FileFilter correctly", async () => {
				await saveFile("raw", "path", { filters: defaultFilters[0] });

				expect(showSaveDialogMock).toHaveBeenCalledWith({
					defaultPath: "path",
					filters: [defaultFilters[0]],
				});
			});

			it("should parse an array of FileFilters correctly", async () => {
				await saveFile("raw", "path", { filters: [defaultFilters[1]] });

				expect(showSaveDialogMock).toHaveBeenCalledWith({
					defaultPath: "path",
					filters: [defaultFilters[1]],
				});
			});

			it.each([null, undefined])("should fallback to the default filters when filters is %s", async (filters) => {
				await saveFile("raw", "path", { filters });

				expect(showSaveDialogMock).toHaveBeenCalledWith({
					defaultPath: "path",
					filters: defaultFilters,
				});
			});
		});

		describe("when restricting the file path", () => {
			it("should not throw an error if the given filepath is valid", async () => {
				showSaveDialogMock = jest.spyOn(electron.remote.dialog, "showSaveDialog").mockImplementation(() => ({
					filePath: "/home/foo/bar",
				}));

				await expect(saveFile(null, null, { restrictToPath: "/home/foo" })).resolves.not.toThrow();
			});

			it("should throw an error if the given filepath is invalid", async () => {
				showSaveDialogMock = jest.spyOn(electron.remote.dialog, "showSaveDialog").mockImplementation(() => ({
					filePath: "/home/bar/foo",
				}));

				await expect(saveFile(null, null, { restrictToPath: "/home/foo" })).rejects.toThrow();
			});
		});
	});

	describe("openFile", () => {
		let showOpenDialogMock;

		beforeEach(() => {
			showOpenDialogMock = jest.spyOn(electron.remote.dialog, "showOpenDialog").mockImplementation(() => ({
				filePaths: ["filePath"],
			}));
		});

		afterEach(() => {
			showOpenDialogMock.mockRestore();
		});

		it("should return early when the obtained filePaths is falsy", async () => {
			showOpenDialogMock = jest.spyOn(electron.remote.dialog, "showOpenDialog").mockImplementation(() => ({
				filePaths: undefined,
			}));

			await expect(openFile()).resolves.toEqual(undefined);
		});

		describe("with filter parameter", () => {
			it("should parse a single FileFilter correctly", async () => {
				await openFile("path", { filters: defaultFilters[0] });

				expect(showOpenDialogMock).toHaveBeenCalledWith({
					defaultPath: "path",
					properties: ["openFile"],
					filters: [defaultFilters[0]],
				});
			});

			it("should parse an array of FileFilters correctly", async () => {
				await openFile("path", { filters: [defaultFilters[1]] });

				expect(showOpenDialogMock).toHaveBeenCalledWith({
					defaultPath: "path",
					properties: ["openFile"],
					filters: [defaultFilters[1]],
				});
			});

			it.each([null, undefined])("should fallback to the default filters when filters is %s", async (filters) => {
				await openFile("path", { filters });

				expect(showOpenDialogMock).toHaveBeenCalledWith({
					defaultPath: "path",
					properties: ["openFile"],
					filters: defaultFilters,
				});
			});
		});

		describe("when restricting the file path", () => {
			it("should not throw an error if the given filepath is valid", async () => {
				showOpenDialogMock = jest.spyOn(electron.remote.dialog, "showOpenDialog").mockImplementation(() => ({
					filePaths: ["/home/foo/bar"],
				}));

				await expect(openFile(null, { restrictToPath: "/home/foo" })).resolves.not.toThrow();
			});

			it("should throw an error if the given filepath is invalid", async () => {
				showOpenDialogMock = jest.spyOn(electron.remote.dialog, "showOpenDialog").mockImplementation(() => ({
					filePaths: ["/home/bar/foo"],
				}));

				await expect(openFile(null, { restrictToPath: "/home/foo" })).rejects.toThrow();
			});
		});
	});
});
