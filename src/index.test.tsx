import { translations } from "app/i18n/common/i18n";
import React from "react";
import { Prompt, Route, Switch, useHistory } from "react-router-dom";
import { fireEvent, render, screen, waitFor } from "utils/testing-library";

import { AppRouter } from "./index";

jest.mock("react-dom", () => ({ render: jest.fn() }));

describe("Application root", () => {
	it("should show confirmation modal", async () => {
		const Component = () => {
			const history = useHistory();

			return (
				<>
					<h1>First</h1>
					<Prompt message={() => "block"} />
					<button onClick={() => history.push("/second")}>Navigate</button>
				</>
			);
		};

		render(
			<AppRouter>
				<Switch>
					<Route path="/" exact>
						<Component />
					</Route>
					<Route path="/second" exact>
						<h2>Second</h2>
					</Route>
				</Switch>
			</AppRouter>,
		);

		expect(screen.getByText("First")).toBeInTheDocument();
		fireEvent.click(screen.getByText("Navigate"));

		await waitFor(() => expect(screen.getByTestId("ConfirmationModal")).toBeInTheDocument());
		fireEvent.click(screen.getByText(translations.NO));

		// Same page without confirmation modal
		expect(screen.getByText("First")).toBeInTheDocument();
		expect(screen.queryByTestId("ConfirmationModal")).not.toBeInTheDocument();

		fireEvent.click(screen.getByText("Navigate"));

		await waitFor(() => expect(screen.getByTestId("ConfirmationModal")).toBeInTheDocument());
		fireEvent.click(screen.getByText(translations.YES));

		expect(screen.getByText("Second")).toBeInTheDocument();
	});
});
