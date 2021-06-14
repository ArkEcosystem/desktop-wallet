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

	it.each(["sm", "lg", "xl"])("should render with size %s", (size) => {
		const { getByTestId } = render(<Address address={sampleAddress} walletName="Sample Wallet" size={size} />);
		expect(getByTestId("Address__alias")).toHaveClass(`text-${size}`);
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
		expect(getByTestId("Address__address")).toHaveClass("text-theme-primary-600");
	});
});
