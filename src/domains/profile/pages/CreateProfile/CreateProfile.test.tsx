/* eslint-disable @typescript-eslint/require-await */
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import React from "react";
import { act, fireEvent, renderWithRouter } from "testing-library";
import { StubStorage } from "tests/mocks";

import { CreateProfile } from "./CreateProfile";

describe("CreateProfile", () => {
	let env: any = null;

	beforeEach(() => {
		env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
	});

	it("should render", () => {
		const { container, getByText, asFragment } = renderWithRouter(<CreateProfile onSubmit={() => void 0} />, {
			routes: ["/", "/profile/create"],
		});

		expect(container).toBeTruthy();
		fireEvent.click(getByText("Back"));

		expect(asFragment()).toMatchSnapshot();
	});

	it("should store profile", async () => {
		let savedProfile: any = null;
		const onSubmit = jest.fn((profile: any) => (savedProfile = profile));

		const { asFragment, container, getAllByTestId, getByTestId } = renderWithRouter(
			<EnvironmentProvider env={env}>
				<CreateProfile onSubmit={onSubmit} />
			</EnvironmentProvider>,
			{
				routes: ["/", "/profile/create"],
			},
		);

		fireEvent.input(getByTestId("Input"), { target: { value: "test profile" } });
		fireEvent.click(getAllByTestId("select-list__toggle-button")[0]);
		fireEvent.click(getByTestId("select-list__toggle-option-0"));
		fireEvent.click(getAllByTestId("select-list__toggle-button")[1]);
		fireEvent.click(getByTestId("select-list__toggle-option-0"));

		await act(async () => {
			fireEvent.click(getByTestId("CreateProfile__submit-button"));
		});

		expect(onSubmit).toHaveBeenNthCalledWith(1, savedProfile);
		expect(savedProfile.name()).toEqual("test profile");
		expect(savedProfile.settings().all()).toEqual({
			CHART_CURRENCY: "option1",
			MARKET_PROVIDER: "option1",
			THEME: "light",
		});

		fireEvent.input(getByTestId("Input"), { target: { value: "test profile 2" } });
		fireEvent.click(container.querySelector("input[name=isDarkMode]"));

		await act(async () => {
			fireEvent.click(getByTestId("CreateProfile__submit-button"));
		});

		expect(onSubmit).toHaveBeenNthCalledWith(1, savedProfile);
		expect(savedProfile.name()).toEqual("test profile 2");
		expect(savedProfile.settings().all()).toEqual({
			CHART_CURRENCY: "option1",
			MARKET_PROVIDER: "option1",
			THEME: "dark",
		});

		expect(env.profiles().all().length).toEqual(2);
		expect(asFragment()).toMatchSnapshot();
	});
});
