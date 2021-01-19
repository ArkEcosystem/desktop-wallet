import { toasts } from "app/services";
import electron from "electron";
import React from "react";
import { act, fireEvent, renderWithRouter } from "testing-library";

import { Link } from "./Link";

describe("Link", () => {
	it("should render", () => {
		const { asFragment, getByTestId } = renderWithRouter(<Link to="/test">Test</Link>);
		expect(getByTestId("Link")).toHaveTextContent("Test");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render external", () => {
		const { getByTestId } = renderWithRouter(
			<Link to="https://ark.io/" isExternal>
				ARK.io
			</Link>,
		);
		expect(getByTestId("Link")).toHaveAttribute("rel", "noopener noreferrer");
		expect(getByTestId("Link__external")).toBeTruthy();
	});

	it("should render external without children", () => {
		const { asFragment, getByTestId } = renderWithRouter(<Link to="https://ark.io" isExternal />);
		expect(getByTestId("Link__external")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should open an external link", () => {
		const ipcRendererMock = jest.spyOn(electron.ipcRenderer, "send").mockImplementation();

		const externalLink = "https://ark.io/";

		const { asFragment, getByTestId } = renderWithRouter(<Link to={externalLink} isExternal />);

		act(() => {
			fireEvent.click(getByTestId("Link"));
		});

		expect(ipcRendererMock).toHaveBeenCalledWith("open-external", externalLink);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should show a toast when trying to open an invalid external link", () => {
		const externalLink = "invalid-url";

		const toastSpy = jest.spyOn(toasts, "error");

		const { asFragment, getByTestId } = renderWithRouter(<Link to={externalLink} isExternal />);

		act(() => {
			fireEvent.click(getByTestId("Link"));
		});

		expect(toastSpy).toHaveBeenCalled();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with tooltip", () => {
		const { asFragment, baseElement, getByTestId } = renderWithRouter(
			<Link to="/test" tooltip="Custom Tooltip">
				Test
			</Link>,
		);
		const link = getByTestId("Link");

		act(() => {
			fireEvent.mouseEnter(link);
		});

		expect(baseElement).toHaveTextContent("Custom Tooltip");

		act(() => {
			fireEvent.click(link);
		});

		expect(asFragment()).toMatchSnapshot();
	});
});
