import { Profile } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { env, getDefaultProfileId, render } from "testing-library";

import { PortfolioChart } from "./PortfolioChart";

let profile: Profile;

describe("PortfolioChart", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
	});

	it("should render", () => {
		const { container } = render(<PortfolioChart profile={profile} />);
		expect(container).toMatchSnapshot();
	});

	it("should render hidden", () => {
		const { container } = render(<PortfolioChart profile={profile} isVisible={false} />);
		expect(container).toMatchSnapshot();
	});

	it("should render with balance", () => {
		//@ts-ignore
		const balancePerCoinMock = jest
			.spyOn(profile.walletAggregate(), "balancePerCoin")
			.mockImplementation(() => ({ ARK: { total: 10, percentage: 3 } }));

		const zeroBalanceMock = jest.spyOn(profile.balance(), "isZero").mockReturnValue(false);

		const { container } = render(<PortfolioChart profile={profile} />);
		expect(container).toMatchSnapshot();

		balancePerCoinMock.mockRestore();
		zeroBalanceMock.mockRestore();
	});
});
