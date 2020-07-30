import React from "react";
import { renderWithRouter, useDefaultNetMocks, waitFor } from "utils/testing-library";

import { translations as profileTranslations } from "../domains/profile/i18n";
import { App } from "./App";

describe("App", () => {
	beforeAll(useDefaultNetMocks);

	it("should render", () => {
		const { container, asFragment, getByText } = renderWithRouter(<App />, { withProviders: false });

		expect(getByText(profileTranslations.PAGE_CREATE_PROFILE.DESCRIPTION)).toBeInTheDocument();

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render mock", async () => {
		process.env.REACT_APP_BUILD_MODE = "demo";

		const { getByTestId } = renderWithRouter(<App />, { withProviders: false });
		await waitFor(() => expect(getByTestId("profile-card__user--avatar")).toBeInTheDocument());
	});
});
