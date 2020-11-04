import electron from "electron";
import React from "react";
import { act, fireEvent, renderWithRouter } from "testing-library";

import { Link } from "./Link";

jest.mock("electron", () => ({
	ipcRenderer: {
		invoke: jest.fn(),
		on: jest.fn(),
		handle: jest.fn(),
		send: jest.fn(),
		removeListener: jest.fn(),
	},
	shell: {
		openExternal: jest.fn(),
	},
}));

describe("Link", () => {
	it("should render", () => {
		const { asFragment, getByTestId } = renderWithRouter(<Link to="/test">Test</Link>);
		expect(getByTestId("Link")).toHaveTextContent("Test");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render external", () => {
		const { getByTestId } = renderWithRouter(
			<Link to="https://ark.io" isExternal>
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
		const externalLink = "https://ark.io";
		const openExternalMock = jest.spyOn(electron.shell, "openExternal").mockImplementation();
		const { asFragment, getByTestId } = renderWithRouter(<Link to={externalLink} isExternal />);
		const link = getByTestId("Link");

		act(() => {
			fireEvent.click(link);
		});
		expect(openExternalMock).toHaveBeenCalledWith(externalLink);
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
