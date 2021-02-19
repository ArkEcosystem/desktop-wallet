import { fireEvent } from "@testing-library/react";
import React from "react";
import { Route } from "react-router-dom";
import { act, renderWithRouter } from "testing-library";

import { useReloadPath } from "./use-reload-path";

describe("useReloadPath hook", () => {
	const TestComponent: React.FC = () => {
		const reloadPath = useReloadPath();

		const handle = () => {
			reloadPath();
		};
		return (
			<h1 data-testid="header_test" onClick={handle}>
				UseReloadPath Test Component
			</h1>
		);
	};

	it("should render useReloadPath", () => {
		const { getByText, getByTestId } = renderWithRouter(
			<Route pathname="/">
				<TestComponent />
			</Route>,
		);

		expect(getByTestId("header_test")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("header_test"));
		});
		expect(getByText("UseReloadPath Test Component")).toBeTruthy();
	});
});
