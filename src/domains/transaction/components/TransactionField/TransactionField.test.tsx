import React from "react";
import { render } from "testing-library";

import { TransactionField } from "./TransactionField";

describe("TransactionField", () => {
	it("should render", () => {
		const { container } = render(<TransactionField label="Test">test</TransactionField>);
		expect(container).toMatchSnapshot();
	});

	it("should render with border", () => {
		const { container } = render(
			<TransactionField label="Test" border={true}>
				test
			</TransactionField>,
		);
		expect(container).toMatchSnapshot();
	});

	it("should render without padding", () => {
		const { container } = render(
			<TransactionField label="Test" padding={false}>
				test
			</TransactionField>,
		);
		expect(container).toMatchSnapshot();
	});

	it("should render with extra children", () => {
		const { container, getByTestId } = render(
			<TransactionField label="Test" padding={false} extra={<div data-testid="TEST_CHILD" />}>
				test
			</TransactionField>,
		);

		expect(getByTestId("TEST_CHILD")).toBeTruthy();
		expect(container).toMatchSnapshot();
	});
});
