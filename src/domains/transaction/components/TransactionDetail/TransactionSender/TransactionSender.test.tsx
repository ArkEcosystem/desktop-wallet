import React from "react";
import { render } from "testing-library";

import { TransactionSender } from "./TransactionSender";

const address = "test-address";

describe("TransactionSender", () => {
	it("should render", () => {
		const { container } = render(<TransactionSender address={address} />);

		expect(container).toHaveTextContent(address);
		expect(container).toMatchSnapshot();
	});

	it("should not render with alias", () => {
		const alias = "test-alias";

		const { container } = render(<TransactionSender address={address} alias={alias} />);

		expect(container).toHaveTextContent(address);
		expect(container).toHaveTextContent(alias);
		expect(container).toMatchSnapshot();
	});

	it("should not render delegate icon", () => {
		const { container } = render(<TransactionSender address={address} isDelegate={true} />);

		expect(container).toHaveTextContent(address);
		expect(container).toHaveTextContent("delegate.svg");
		expect(container).toMatchSnapshot();
	});
});
