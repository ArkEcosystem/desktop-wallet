import React from "react";
import { env, render } from "utils/testing-library";

import { Balance } from "./Balance";

describe("Balance", () => {
	it("should render", () => {
		const profile = env.profiles().first();
		const { container } = render(<Balance profile={profile} isLoading={false} />);

		expect(container).toMatchSnapshot();
	});

	it("should render if ticker is unavailable", () => {
		const profile = env.profiles().first();
		const profileSettingsMock = jest.spyOn(profile.settings(), "get").mockReturnValue(undefined);
		const profileBalanceMock = jest.spyOn(profile, "convertedBalance").mockReturnValue(undefined);

		const { container } = render(<Balance profile={profile} isLoading={false} />);

		expect(container).toMatchSnapshot();
		profileSettingsMock.mockRestore();
		profileBalanceMock.mockRestore();
	});

	it("should render loading state", () => {
		const profile = env.profiles().first();
		const { container } = render(<Balance profile={profile} isLoading={true} />);

		expect(container).toMatchSnapshot();
	});
});
