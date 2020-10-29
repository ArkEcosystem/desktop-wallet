import React from "react";
import { render } from "testing-library";

import { TransactionSender } from "./TransactionSender";

const wallet = {
	address: () => "test-address",
	alias: () => undefined,
	username: () => "test-username",
	isDelegate: () => false,
	isResignedDelegate: () => false,
};

describe("TransactionSender", () => {
	it("should render", () => {
		const { container } = render(<TransactionSender address={wallet.address()} />);

		expect(container).toHaveTextContent(wallet.address());
		expect(container).toMatchSnapshot();
	});

	it("should render the alias if available", () => {
		const { container } = render(
			<TransactionSender
				address={wallet.address()}
				wallet={{
					...wallet,
					alias: () => "test-alias",
				}}
			/>,
		);

		expect(container).toHaveTextContent(wallet.address());
		expect(container).toHaveTextContent("test-alias");

		expect(container).toMatchSnapshot();
	});

	describe("if wallet is a delegate", () => {
		it("should render delegate name", () => {
			const { container } = render(
				<TransactionSender
					address={wallet.address()}
					wallet={{
						...wallet,
						isDelegate: () => true,
					}}
				/>,
			);

			expect(container).toHaveTextContent(wallet.username());

			expect(container).toMatchSnapshot();
		});

		it("should render alias over delegate name", () => {
			const { container } = render(
				<TransactionSender
					address={wallet.address()}
					wallet={{
						...wallet,
						alias: () => "test-alias",
						isDelegate: () => true,
					}}
				/>,
			);

			expect(container).toHaveTextContent("test-alias");
			expect(container).not.toHaveTextContent(wallet.username());

			expect(container).toMatchSnapshot();
		});

		it("should render delegate icon", () => {
			const { container } = render(
				<TransactionSender
					address={wallet.address()}
					wallet={{
						...wallet,
						isDelegate: () => true,
					}}
				/>,
			);

			expect(container).toHaveTextContent("delegate.svg");

			expect(container).toMatchSnapshot();
		});

		it("should not render delegate icon if wallet is a resigned delegate", () => {
			const { container } = render(
				<TransactionSender
					address={wallet.address()}
					wallet={{
						...wallet,
						isDelegate: () => true,
						isResignedDelegate: () => true,
					}}
				/>,
			);

			expect(container).not.toHaveTextContent("delegate.svg");

			expect(container).toMatchSnapshot();
		});
	});
});
