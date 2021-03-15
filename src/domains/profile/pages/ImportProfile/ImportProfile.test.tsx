/* eslint-disable @typescript-eslint/require-await */
import { EnvironmentProvider } from "app/contexts";
import { ImportProfile } from "domains/profile/pages/ImportProfile/ImportProfile";
import fs from "fs";
import { createMemoryHistory } from "history";
import React from "react";
import { act, env, fireEvent, renderWithRouter, waitFor } from "utils/testing-library";

const passwordProtectedDwe = fs.readFileSync("src/tests/fixtures/profile/import/password-protected-profile.dwe");
const corruptedDwe = fs.readFileSync("src/tests/fixtures/profile/import/corrupted-profile.dwe");
const history = createMemoryHistory();

describe("ImportProfile", () => {
	let consoleSpy: jest.SpyInstance;
	let fsMock: jest.SpyInstance;

	beforeAll(() => {
		consoleSpy = jest.spyOn(console, "log").mockImplementation(() => undefined);
		console.log("");
		fsMock = jest.spyOn(fs, "readFileSync").mockReturnValue(passwordProtectedDwe);
	});

	afterAll(() => {
		consoleSpy.mockRestore();
		fsMock.mockRestore();
	});

	it("should render first step", async () => {
		const history = createMemoryHistory();
		history.push(`/profiles/import`);

		const { container, getByTestId } = renderWithRouter(
			<EnvironmentProvider env={env}>
				<ImportProfile />
			</EnvironmentProvider>,
		);

		expect(getByTestId("SelectFileStep__change-file")).toBeInTheDocument();

		expect(container).toMatchSnapshot();
	});

	it("should go back", async () => {
		history.push(`/profiles/import`);
		const historyMock = jest.spyOn(history, "push").mockReturnValue();

		const { getByTestId } = renderWithRouter(
			<EnvironmentProvider env={env}>
				<ImportProfile />
			</EnvironmentProvider>,
			{ history },
		);

		expect(getByTestId("SelectFileStep__change-file")).toBeInTheDocument();
		expect(getByTestId("SelectFileStep__back")).toBeInTheDocument();

		act(() => {
			fireEvent.click(getByTestId("SelectFileStep__back"));
		});

		await waitFor(() => expect(historyMock).toHaveBeenCalled());
		historyMock.mockRestore();
	});

	it("should change file format", async () => {
		history.push(`/profiles/import`);

		const { getByTestId } = renderWithRouter(
			<EnvironmentProvider env={env}>
				<ImportProfile />
			</EnvironmentProvider>,
			{ history },
		);

		expect(getByTestId("SelectFileStep__change-file")).toBeInTheDocument();

		act(() => {
			fireEvent.click(getByTestId("SelectFileStep__change-file"));
		});

		await waitFor(() => expect(() => getByTestId("SelectFileStep__change-file")).toThrow());
	});

	it("should select file and go to step 2", async () => {
		history.push(`/profiles/import`);

		const { getByTestId } = renderWithRouter(
			<EnvironmentProvider env={env}>
				<ImportProfile />
			</EnvironmentProvider>,
			{ history },
		);

		expect(getByTestId("SelectFileStep__change-file")).toBeInTheDocument();
		expect(getByTestId("SelectFileStep__back")).toBeInTheDocument();

		act(() => {
			fireEvent.drop(getByTestId("SelectFile__browse-files"), {
				dataTransfer: {
					files: [{ name: "profile-export.dwe", path: "path/to/sample-export.dwe" }],
				},
			});
		});

		await waitFor(() => expect(getByTestId("ProcessingImport")).toBeInTheDocument());
	});

	it("should request and set password for importing password protected profile", async () => {
		history.push(`/profiles/import`);

		const { getByTestId, findByTestId } = renderWithRouter(
			<EnvironmentProvider env={env}>
				<ImportProfile />
			</EnvironmentProvider>,
			{ history },
		);

		expect(getByTestId("SelectFileStep__change-file")).toBeInTheDocument();
		expect(getByTestId("SelectFileStep__back")).toBeInTheDocument();

		act(() => {
			fireEvent.drop(getByTestId("SelectFile__browse-files"), {
				dataTransfer: {
					files: [{ name: "profile-export.dwe", path: "path/to/sample-export.dwe" }],
				},
			});
		});

		await waitFor(() => expect(getByTestId("ProcessingImport")).toBeInTheDocument());
		await waitFor(() => expect(getByTestId("modal__inner")).toBeInTheDocument());

		await act(async () => {
			fireEvent.input(getByTestId("PasswordModal__input"), { target: { value: "testtest" } });
		});

		// wait for formState.isValid to be updated
		await findByTestId("PasswordModal__submit-button");

		act(() => {
			fireEvent.click(getByTestId("PasswordModal__submit-button"));
		});

		await waitFor(() => expect(getByTestId("ProcessingImport")).toBeInTheDocument());
	});

	it("should close password modal and go back to select file", async () => {
		history.push(`/profiles/import`);

		const { getByTestId } = renderWithRouter(
			<EnvironmentProvider env={env}>
				<ImportProfile />
			</EnvironmentProvider>,
			{ history },
		);

		expect(getByTestId("SelectFileStep__change-file")).toBeInTheDocument();
		expect(getByTestId("SelectFileStep__back")).toBeInTheDocument();

		act(() => {
			fireEvent.drop(getByTestId("SelectFile__browse-files"), {
				dataTransfer: {
					files: [{ name: "profile-export.dwe", path: "path/to/sample-export.dwe" }],
				},
			});
		});

		await waitFor(() => expect(getByTestId("ProcessingImport")).toBeInTheDocument());
		await waitFor(() => expect(getByTestId("modal__inner")).toBeInTheDocument());

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});

		await waitFor(() => expect(getByTestId("SelectFileStep__change-file")).toBeInTheDocument());
	});

	it("should succesfully import profile and return to home screen", async () => {
		history.push(`/profiles/import`);
		const historyMock = jest.spyOn(history, "push").mockReturnValue();
		const fsReadFileMock = jest.spyOn(fs, "readFileSync").mockReturnValue(passwordProtectedDwe);

		const { getByTestId } = renderWithRouter(
			<EnvironmentProvider env={env}>
				<ImportProfile />
			</EnvironmentProvider>,
			{ history },
		);

		expect(getByTestId("SelectFileStep__change-file")).toBeInTheDocument();
		expect(getByTestId("SelectFileStep__back")).toBeInTheDocument();

		act(() => {
			fireEvent.drop(getByTestId("SelectFile__browse-files"), {
				dataTransfer: {
					files: [{ name: "profile-export.dwe", path: "path/to/sample-export.dwe" }],
				},
			});
		});

		await waitFor(() => expect(getByTestId("ProcessingImport")).toBeInTheDocument());
		await waitFor(() => expect(getByTestId("modal__inner")).toBeInTheDocument());

		await act(async () => {
			fireEvent.input(getByTestId("PasswordModal__input"), { target: { value: "testtest" } });
		});

		act(() => {
			fireEvent.click(getByTestId("PasswordModal__submit-button"));
		});

		await waitFor(() => expect(getByTestId("ProcessingImport")).toBeInTheDocument());
		await waitFor(() => expect(getByTestId("CreateProfile__form")).toBeInTheDocument());

		act(() => {
			fireEvent.click(getByTestId("CreateProfile__submit-button"));
		});

		await waitFor(() => expect(historyMock).toHaveBeenCalledWith("/"));
	});

	it("should go to step 3 and back", async () => {
		history.push(`/profiles/import`);

		const { getByTestId } = renderWithRouter(
			<EnvironmentProvider env={env}>
				<ImportProfile />
			</EnvironmentProvider>,
			{ history },
		);

		expect(getByTestId("SelectFileStep__change-file")).toBeInTheDocument();
		expect(getByTestId("SelectFileStep__back")).toBeInTheDocument();

		act(() => {
			fireEvent.drop(getByTestId("SelectFile__browse-files"), {
				dataTransfer: {
					files: [{ name: "profile-export.dwe", path: "path/to/sample-export.dwe" }],
				},
			});
		});

		await waitFor(() => expect(getByTestId("ProcessingImport")).toBeInTheDocument());
		await waitFor(() => expect(getByTestId("modal__inner")).toBeInTheDocument());

		await act(async () => {
			fireEvent.input(getByTestId("PasswordModal__input"), { target: { value: "testtest" } });
		});

		act(() => {
			fireEvent.click(getByTestId("PasswordModal__submit-button"));
		});

		await waitFor(() => expect(getByTestId("ProcessingImport")).toBeInTheDocument());
		await waitFor(() => expect(getByTestId("CreateProfile__form")).toBeInTheDocument());

		act(() => {
			fireEvent.click(getByTestId("CreateProfile__back-button"));
		});

		await waitFor(() => expect(getByTestId("SelectFileStep__change-file")).toBeInTheDocument());
	});

	it("should fail profile import and show error step", async () => {
		history.push(`/profiles/import`);
		const corruptedDweMock = jest.spyOn(fs, "readFileSync").mockReturnValue(corruptedDwe);

		const { getByTestId } = renderWithRouter(
			<EnvironmentProvider env={env}>
				<ImportProfile />
			</EnvironmentProvider>,
			{ history },
		);

		expect(getByTestId("SelectFileStep__change-file")).toBeInTheDocument();
		expect(getByTestId("SelectFileStep__back")).toBeInTheDocument();

		act(() => {
			fireEvent.drop(getByTestId("SelectFile__browse-files"), {
				dataTransfer: {
					files: [{ name: "profile-export.dwe", path: "path/to/sample-export.dwe" }],
				},
			});
		});

		await waitFor(() => expect(getByTestId("ProcessingImport")).toBeInTheDocument());
		await waitFor(() => expect(getByTestId("modal__inner")).toBeInTheDocument());

		await act(async () => {
			fireEvent.input(getByTestId("PasswordModal__input"), { target: { value: "wrong password" } });
		});

		act(() => {
			fireEvent.click(getByTestId("PasswordModal__submit-button"));
		});

		await waitFor(() => expect(getByTestId("ImportError")).toBeInTheDocument());

		corruptedDweMock.mockRestore();
	});

	it("should fail profile import and retry", async () => {
		history.push(`/profiles/import`);
		const corruptedDweMock = jest.spyOn(fs, "readFileSync").mockReturnValue(corruptedDwe);

		const { getByTestId } = renderWithRouter(
			<EnvironmentProvider env={env}>
				<ImportProfile />
			</EnvironmentProvider>,
			{ history },
		);

		expect(getByTestId("SelectFileStep__change-file")).toBeInTheDocument();
		expect(getByTestId("SelectFileStep__back")).toBeInTheDocument();

		act(() => {
			fireEvent.drop(getByTestId("SelectFile__browse-files"), {
				dataTransfer: {
					files: [{ name: "profile-export.dwe", path: "path/to/sample-export.dwe" }],
				},
			});
		});

		await waitFor(() => expect(getByTestId("ProcessingImport")).toBeInTheDocument());
		await waitFor(() => expect(getByTestId("modal__inner")).toBeInTheDocument());

		await act(async () => {
			fireEvent.input(getByTestId("PasswordModal__input"), { target: { value: "wrong password" } });
		});

		act(() => {
			fireEvent.click(getByTestId("PasswordModal__submit-button"));
		});

		await waitFor(() => expect(getByTestId("ImportError")).toBeInTheDocument());

		act(() => {
			fireEvent.click(getByTestId("ImportError__retry"));
		});

		await waitFor(() => expect(getByTestId("ImportError")).toBeInTheDocument());
		corruptedDweMock.mockRestore();
	});

	it("should fail profile import and go back to home screen", async () => {
		history.push(`/profiles/import`);
		const corruptedDweMock = jest.spyOn(fs, "readFileSync").mockReturnValue(corruptedDwe);
		const historyMock = jest.spyOn(history, "push").mockReturnValue();

		const { getByTestId } = renderWithRouter(
			<EnvironmentProvider env={env}>
				<ImportProfile />
			</EnvironmentProvider>,
			{ history },
		);

		expect(getByTestId("SelectFileStep__change-file")).toBeInTheDocument();
		expect(getByTestId("SelectFileStep__back")).toBeInTheDocument();

		act(() => {
			fireEvent.drop(getByTestId("SelectFile__browse-files"), {
				dataTransfer: {
					files: [{ name: "profile-export.dwe", path: "path/to/sample-export.dwe" }],
				},
			});
		});

		await waitFor(() => expect(getByTestId("ProcessingImport")).toBeInTheDocument());
		await waitFor(() => expect(getByTestId("modal__inner")).toBeInTheDocument());

		await act(async () => {
			fireEvent.input(getByTestId("PasswordModal__input"), { target: { value: "wrong password" } });
		});

		act(() => {
			fireEvent.click(getByTestId("PasswordModal__submit-button"));
		});

		await waitFor(() => expect(getByTestId("ImportError")).toBeInTheDocument());

		act(() => {
			fireEvent.click(getByTestId("ImportError__back"));
		});

		await waitFor(() => expect(getByTestId("ImportError")).toBeInTheDocument());
		await waitFor(() => expect(historyMock).toHaveBeenCalledWith("/"));

		historyMock.mockRestore();
		corruptedDweMock.mockRestore();
	});
});
