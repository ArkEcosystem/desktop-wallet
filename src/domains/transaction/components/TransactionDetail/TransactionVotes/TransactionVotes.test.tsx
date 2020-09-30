import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { render, waitFor } from "testing-library";

import { TransactionVotes } from "./TransactionVotes";

const votes = [
	new ReadOnlyWallet({
		address: "test-address",
		username: "test-username",
	}),
];

describe("TransactionVotes", () => {
	it("should render loading state", () => {
		const { container, getByTestId } = render(<TransactionVotes isLoading={true} />);

		expect(getByTestId("TransactionVotes__skeleton")).toBeTruthy();

		expect(container).toMatchSnapshot();
	});

	it("should render with votes", async () => {
		const { container, getByText } = render(<TransactionVotes votes={votes} />);

		await waitFor(() => expect(getByText("Votes (1)")).toBeInTheDocument());
		await waitFor(() => expect(getByText("test-username")).toBeInTheDocument());

		expect(container).toMatchSnapshot();
	});

	it("should render with unvotes", async () => {
		const { container, getByText } = render(<TransactionVotes unvotes={votes} />);

		await waitFor(() => expect(getByText("Unvotes (1)")).toBeInTheDocument());
		await waitFor(() => expect(getByText("test-username")).toBeInTheDocument());

		expect(container).toMatchSnapshot();
	});

	it("should render with votes and unvotes", async () => {
		const { container, getByText, getAllByText } = render(<TransactionVotes votes={votes} unvotes={votes} />);

		await waitFor(() => expect(getByText("Votes (1)")).toBeInTheDocument());
		await waitFor(() => expect(getByText("Unvotes (1)")).toBeInTheDocument());
		await waitFor(() => expect(getAllByText("test-username")).toHaveLength(2));

		expect(container).toMatchSnapshot();
	});
});
