import { waitFor } from "@testing-library/react";
import electron from "electron";
import React from "react";
import { act, fireEvent, render } from "testing-library";

import { openFile } from "../../../utils/electron-utils";
import { SelectProfileImage } from "./SelectProfileImage";

describe("SelectProfileImage", () => {
	it("should render", () => {
		const onSelect = jest.fn();

		const { container } = render(<SelectProfileImage onSelect={onSelect} />);

		expect(container).toMatchSnapshot();
	});

	it("should render with value svg", () => {
		const onSelect = jest.fn();

		const { container } = render(<SelectProfileImage value="<svg>test</svg>" onSelect={onSelect} />);

		expect(container).toMatchSnapshot();
	});

	it("should render without value svg", () => {
		const onSelect = jest.fn();

		const { container, getByTestId } = render(<SelectProfileImage value="test" onSelect={onSelect} />);
		expect(container).toMatchSnapshot();

		act(() => {
			fireEvent.click(getByTestId("SelectProfileImage__remove-button"));
		});

		expect(onSelect).toBeCalled();
	});

	it("should handle upload file", async () => {
		const onSelect = jest.fn();

		const { container, getByTestId } = render(<SelectProfileImage value="test" onSelect={onSelect} />);
		expect(container).toMatchSnapshot();
		const openFileDialog = jest.spyOn(electron.remote.dialog, "showOpenDialog").mockImplementation(() => ({
			filePaths: ["banner.png"],
		}));

		const btn = getByTestId("SelectProfileImage__upload-button");
		btn.onClick = openFileDialog;
		act(() => {
			fireEvent.click(getByTestId("SelectProfileImage__upload-button"));
		});

		await expect(
			openFile(null, {
				filters: { name: "Images", extensions: ["png", "jpg", "jpeg", "bmp"] },
				encoding: "base64",
			}),
		).resolves.not.toThrow();

		await waitFor(() => expect(onSelect).toBeCalled());
	});

	it("shouldn't handle upload file", async () => {
		const onSelect = jest.fn();

		const { container, getByTestId } = render(<SelectProfileImage value="test" onSelect={onSelect} />);
		expect(container).toMatchSnapshot();
		const openFileDialog = jest.spyOn(electron.remote.dialog, "showOpenDialog").mockImplementation(() => ({
			filePaths: null,
		}));

		const btn = getByTestId("SelectProfileImage__upload-button");
		btn.onClick = openFileDialog;
		act(() => {
			fireEvent.click(getByTestId("SelectProfileImage__upload-button"));
		});

		await waitFor(() => expect(onSelect).not.toBeCalled());
	});
});
