import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import React from "react";
import { identity } from "tests/fixtures/identity";
import { StubStorage } from "tests/mocks";
import { fireEvent, renderWithRouter } from "utils/testing-library";
import { env } from "utils/testing-library";

import { translations } from "../../i18n";
import { Welcome } from "../Welcome";

describe("Welcome", () => {
	it("should render with profiles", () => {
		const { container, getByText, asFragment, history } = renderWithRouter(<Welcome />);
		const profile = env.profiles().findById(identity.profiles.bob.id);

		expect(getByText(translations.PAGE_WELCOME.HAS_PROFILES)).toBeInTheDocument();

		expect(container).toBeTruthy();
		fireEvent.click(getByText(profile.name()));
		expect(history.location.pathname).toEqual(`/profiles/${profile.id()}/dashboard`);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without profiles", () => {
		const env = new Environment({ coins: {}, httpClient, storage: new StubStorage() });
		const { container, asFragment, getByText } = renderWithRouter(
			<EnvironmentProvider env={env}>
				<Welcome />
			</EnvironmentProvider>,
		);

		expect(getByText(translations.PAGE_CREATE_PROFILE.DESCRIPTION)).toBeInTheDocument();

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should change route to create profile", () => {
		const { container, getByText, asFragment, history } = renderWithRouter(<Welcome />);

		expect(getByText(translations.PAGE_CREATE_PROFILE.DESCRIPTION)).toBeInTheDocument();

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
		fireEvent.click(getByText("Create Profile"));
		expect(history.location.pathname).toEqual("/profiles/create");
	});
});
