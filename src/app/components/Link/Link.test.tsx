import React from "react";
import { act, fireEvent, renderWithRouter } from "testing-library";

import { Link } from "./Link";

describe("Link", () => {
	it("should render", () => {
		const { getByTestId, asFragment } = renderWithRouter(<Link to="/test">Test</Link>);
		expect(getByTestId("Link")).toHaveTextContent("Test");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render external", () => {
		const { getByTestId, asFragment } = renderWithRouter(
			<Link to={{ pathname: "https://ark.io" }} isExternal>
				ARK.io
			</Link>,
		);
		expect(getByTestId("Link")).toHaveAttribute("rel", "noopener noreferrer");
		expect(getByTestId("Link")).toHaveAttribute("target", "_blank");
		expect(getByTestId("Link__external")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render external without children", () => {
		const { getByTestId, asFragment } = renderWithRouter(<Link to={{ pathname: "https://ark.io" }} isExternal />);
		expect(getByTestId("Link__external")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with tooltip", () => {
		const { getByTestId, baseElement } = renderWithRouter(
			<Link to="/test" tooltip="Custom Tooltip">
				Test
			</Link>,
		);

		act(() => {
			fireEvent.mouseEnter(getByTestId("Link"));
		});

		expect(baseElement).toHaveTextContent("Custom Tooltip");
	});
});
