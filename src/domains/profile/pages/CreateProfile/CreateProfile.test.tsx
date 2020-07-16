/* eslint-disable @typescript-eslint/require-await */
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { httpClient } from "app/services";
import React from "react";
import { act, fireEvent, renderWithRouter } from "testing-library";
import { StubStorage } from "tests/mocks";

import { CreateProfile } from "./CreateProfile";

let env: any;

describe("CreateProfile", () => {
	beforeEach(() => {
		env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
	});

	it("should render", () => {
		const { container, getByText, asFragment } = renderWithRouter(<CreateProfile />, {
			routes: ["/", "/profile/create"],
		});

		expect(container).toBeTruthy();
		fireEvent.click(getByText("Back"));

		expect(asFragment()).toMatchSnapshot();
	});

	it("should store profile", async () => {
		const { asFragment, container, getAllByTestId, getByTestId } = renderWithRouter(
			<EnvironmentProvider env={env}>
				<CreateProfile />
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

		let profiles = env.profiles().all();
		expect(profiles.length).toEqual(1);
		expect(profiles[0].name()).toEqual("test profile");
		expect(profiles[0].settings().all()).toEqual({
			EXCHANGE_CURRENCY: "option1",
			MARKET_PROVIDER: "option1",
			THEME: "light",
		});

		fireEvent.input(getByTestId("Input"), { target: { value: "test profile 2" } });
		fireEvent.click(container.querySelector("input[name=isDarkMode]"));

		await act(async () => {
			fireEvent.click(getByTestId("CreateProfile__submit-button"));
		});

		profiles = env.profiles().all();
		expect(profiles.length).toEqual(2);
		expect(profiles[1].name()).toEqual("test profile 2");
		expect(profiles[1].settings().all()).toEqual({
			EXCHANGE_CURRENCY: "option1",
			MARKET_PROVIDER: "option1",
			THEME: "dark",
		});

		expect(asFragment()).toMatchSnapshot();
	});
});
