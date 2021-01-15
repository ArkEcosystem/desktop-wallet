import React from "react";
import { render } from "testing-library";

import { Address } from "./Address";

const sampleAddress = "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT";

describe("Formatted Address", () => {
	it("should render address only", () => {
		const { container } = render(<Address address={sampleAddress} />);
		expect(container).toMatchSnapshot();
	});

	it("should render with wallet name", () => {
		const { container } = render(<Address address={sampleAddress} walletName="Sample Wallet" />);
		expect(container).toMatchSnapshot();
	});

	it("should not render without address", () => {
		const { container } = render(<Address />);
		expect(container).toMatchSnapshot();
	});

	it("should render a small one", () => {
		const { getByTestId } = render(<Address address={sampleAddress} walletName="Sample Wallet" size="sm" />);
		expect(getByTestId("address__wallet-name")).toHaveClass("text-sm");
	});

	it("should render a default one", () => {
		const { getByTestId } = render(<Address address={sampleAddress} walletName="Sample Wallet" />);
		expect(getByTestId("address__wallet-name")).toHaveClass("text-base");
	});

	it("should render a large one", () => {
		const { getByTestId } = render(<Address address={sampleAddress} walletName="Sample Wallet" size="lg" />);
		expect(getByTestId("address__wallet-name")).toHaveClass("text-xl");
	});

	it("should render with normal font", () => {
		const { container } = render(
			<Address fontWeight="normal" address={sampleAddress} walletName="Sample Wallet" />,
		);
		expect(container).toMatchSnapshot();
	});

	it("should render with custom class for address", () => {
		const { getByTestId } = render(
			<Address
				addressClass="text-theme-primary-600"
				address={sampleAddress}
				walletName="Sample Wallet"
				size="lg"
			/>,
		);
		expect(getByTestId("address__wallet-address")).toHaveClass("text-theme-primary-600");
	});
});
