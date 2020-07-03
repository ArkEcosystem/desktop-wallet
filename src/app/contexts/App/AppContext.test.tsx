import React from "react";
import { act, render, screen, waitFor } from "testing-library";

import { AppContextConsumer, AppContextProvider } from "./AppContext";

describe("Environment Context", () => {
	it("should render the wrapper properly", async () => {
		let updateAction;

		const { container, asFragment } = render(
			<AppContextProvider>
				<AppContextConsumer>
					{({ appState, updateAppState }) => {
						updateAction = updateAppState;
						return <span>{appState.content}</span>;
					}}
				</AppContextConsumer>
			</AppContextProvider>,
		);

		act(() => {
			updateAction("content", "testing");
		});

		await waitFor(async () => {
			await expect(screen.findByText("testing")).resolves.toBeInTheDocument();
		});

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
