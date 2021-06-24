import { screen, waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import userEvent from "@testing-library/user-event";
import { useFiles } from "app/hooks/use-files";
import { translations } from "app/i18n/common/i18n";
import { toasts } from "app/services";
import electron from "electron";
import React from "react";
import { render } from "testing-library";

import { SelectProfileImage } from "./SelectProfileImage";

describe("SelectProfileImage", () => {
	it("should render", () => {
		const onSelect = jest.fn();

		const { asFragment } = render(<SelectProfileImage onSelect={onSelect} />);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with value svg", () => {
		const onSelect = jest.fn();

		const { asFragment } = render(<SelectProfileImage value="<svg>test</svg>" onSelect={onSelect} />);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without value svg", () => {
		const onSelect = jest.fn();

		const { asFragment } = render(<SelectProfileImage value="test" onSelect={onSelect} />);
		expect(asFragment()).toMatchSnapshot();

		userEvent.click(screen.getByTestId("SelectProfileImage__remove-button"));

		expect(onSelect).toBeCalled();
	});

	it("should handle upload file", async () => {
		const onSelect = jest.fn();

		const { asFragment } = render(<SelectProfileImage value="test" onSelect={onSelect} />);
		const { result: useFilesResult } = renderHook(() => useFiles());

		expect(asFragment()).toMatchSnapshot();
		const openFileDialog = jest.spyOn(electron.remote.dialog, "showOpenDialog").mockImplementation(
			() =>
				({
					filePaths: ["banner.png"],
				} as any),
		);

		const button = screen.getByTestId("SelectProfileImage__upload-button");
		button.addEventListener("click", openFileDialog as any);
		userEvent.click(screen.getByTestId("SelectProfileImage__upload-button"));

		await expect(
			useFilesResult.current.openFile({
				extensions: ["png", "jpg", "jpeg", "bmp"],
			}),
		).resolves.not.toThrow();

		await waitFor(() => expect(onSelect).toBeCalled());
	});

	it("should not allow to upload an invalid file image", async () => {
		const onSelect = jest.fn();
		const toastSpy = jest.spyOn(toasts, "error");

		const { asFragment } = render(<SelectProfileImage value="test" onSelect={onSelect} />);

		expect(asFragment()).toMatchSnapshot();

		const openFileDialog = jest.spyOn(electron.remote.dialog, "showOpenDialog").mockImplementation(
			() =>
				({
					filePaths: ["notAnImage.png"],
				} as any),
		);

		const button = screen.getByTestId("SelectProfileImage__upload-button");
		button.addEventListener("click", openFileDialog as any);
		userEvent.click(screen.getByTestId("SelectProfileImage__upload-button"));

		await waitFor(() => expect(toastSpy).toHaveBeenCalledWith(translations.ERRORS.INVALID_IMAGE));
	});

	it("should not handle upload file", async () => {
		const onSelect = jest.fn();

		const { asFragment } = render(<SelectProfileImage value="test" onSelect={onSelect} />);

		expect(asFragment()).toMatchSnapshot();

		const openFileDialog = jest.spyOn(electron.remote.dialog, "showOpenDialog").mockImplementation(
			() =>
				({
					filePaths: null,
				} as any),
		);

		const button = screen.getByTestId("SelectProfileImage__upload-button");
		button.addEventListener("click", openFileDialog as any);
		userEvent.click(screen.getByTestId("SelectProfileImage__upload-button"));

		await waitFor(() => expect(onSelect).not.toBeCalled());
	});
});
