import { act, fireEvent, render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { Link } from "./Link";

describe("Link", () => {
	it("should render", () => {
		const { getByTestId, asFragment } = render(
			<MemoryRouter>
				<Link to="/test">Test</Link>
			</MemoryRouter>,
		);
		expect(getByTestId("Link")).toHaveTextContent("Test");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render external", () => {
		const { getByTestId, asFragment } = render(
			<MemoryRouter>
				<Link to={{ pathname: "https://ark.io" }} isExternal>
					ARK.io
				</Link>
			</MemoryRouter>,
		);
		expect(getByTestId("Link")).toHaveAttribute("rel", "noopener noreferrer");
		expect(getByTestId("Link")).toHaveAttribute("target", "_blank");
		expect(getByTestId("Link__external")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render external without children", () => {
		const { getByTestId, asFragment } = render(
			<MemoryRouter>
				<Link to={{ pathname: "https://ark.io" }} isExternal />
			</MemoryRouter>,
		);
		expect(getByTestId("Link__external")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with tooltip", () => {
		const { getByTestId, baseElement } = render(
			<MemoryRouter>
				<Link to="/test" tooltip="Custom Tooltip">
					Test
				</Link>
			</MemoryRouter>,
		);

		act(() => {
			fireEvent.mouseEnter(getByTestId("Link"));
		});

		expect(baseElement).toHaveTextContent("Custom Tooltip");
	});
});
