import React from "react";
import { render } from "testing-library";

import { WalletCard } from "./WalletCard";

describe("Formatted Address", () => {
	it("should render", () => {
		const { container } = render(<WalletCard />);
		expect(container).toMatchSnapshot();
	});

	it("should render blank", () => {
		const { container } = render(<WalletCard isBlank={true} />);
		expect(container).toMatchSnapshot();
	});

	it("should render with wallet data", () => {
		const { container } = render(
			<WalletCard
				coinIcon="Bitcoin"
				coinClass="border-theme-warning-200"
				avatarId="test"
				walletName="My wallet"
				address="ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT"
				balance="100,000 BTC"
			/>,
		);
		expect(container).toMatchSnapshot();
	});

	it("should render with wallet data and optional icon", () => {
		const { container } = render(
			<WalletCard
				coinIcon="Bitcoin"
				coinClass="border-theme-warning-200"
				avatarId="test"
				walletName="My wallet"
				address="ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT"
				balance="100,000 BTC"
			/>,
		);
		expect(container).toMatchSnapshot();
	});
});
