import { Environment, Profile } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import React from "react";
import { StubStorage } from "tests/mocks";
import { act, fireEvent, render, waitFor } from "utils/testing-library";

import { DeleteProfile } from "./DeleteProfile";

describe("DeleteProfile", () => {
	let env: Environment;
	let profile: Profile;

	beforeEach(() => {
		env = new Environment({ coins: {}, httpClient, storage: new StubStorage() });
		profile = env.profiles().create("Test");
	});

	it("should render", async () => {
		const { getByTestId, asFragment } = render(
			<EnvironmentProvider env={env}>
				<DeleteProfile isOpen profileId={profile.id()} />
			</EnvironmentProvider>,
		);
		await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());
		expect(getByTestId("DeleteResource__submit-button")).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should delete", async () => {
		const { getByTestId } = render(
			<EnvironmentProvider env={env}>
				<DeleteProfile isOpen profileId={profile.id()} />
			</EnvironmentProvider>,
		);
		await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("DeleteResource__submit-button"));
		});

		await waitFor(() => expect(env.profiles().all()).toHaveLength(0));
	});
});
