import React from "react";
import { render } from "@testing-library/react";

import { Address } from "./Address";
import { truncateStringMiddle } from "./utils";

describe("Formatted Address", () => {
	const sampleAddress = "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT";

	it("should render address only", () => {
		const { container } = render(<Address address={sampleAddress}></Address>);
		expect(container).toMatchSnapshot();
	});

	it("should render with wallet name", () => {
		const { container } = render(<Address address={sampleAddress} walletName="Sample Wallet"></Address>);
		expect(container).toMatchSnapshot();
	});

	it("should not render without address", () => {
		const { container } = render(<Address />);
		expect(container).toMatchSnapshot();
	});

	it("should render a small one", () => {
		const { getByTestId } = render(<Address address={sampleAddress} walletName="Sample Wallet" size="small" />);
		expect(getByTestId("address__wallet-name")).toHaveClass("text-sm");
	});

	it("should render a default one", () => {
		const { getByTestId } = render(<Address address={sampleAddress} walletName="Sample Wallet" />);
		expect(getByTestId("address__wallet-name")).toHaveClass("text-base");
	});

	it("should render a large one", () => {
		const { getByTestId } = render(<Address address={sampleAddress} walletName="Sample Wallet" size="large" />);
		expect(getByTestId("address__wallet-name")).toHaveClass("text-xl");
	});
});

describe("Truncate string utility", () => {
	const sampleAddress = "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT";

	it("should truncate with default maxChars", () => {
		const string = truncateStringMiddle(sampleAddress);
		expect(string).toEqual("ASuusXSW...T9GQ3kqT");
	});

	it("should truncate with maxChars 20", () => {
		const string = truncateStringMiddle(sampleAddress, 28);
		expect(string).toEqual("ASuusXSW9kfW...ttP6T9GQ3kqT");
	});

	it("should not truncate if string is less than maxChars", () => {
		const string = truncateStringMiddle("1234");
		expect(string).toEqual("1234");
	});
});
