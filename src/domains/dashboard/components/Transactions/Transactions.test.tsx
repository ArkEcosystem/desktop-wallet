import { DelegateMapper, ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { renderWithRouter } from "utils/testing-library";

import { transactions } from "../../data";
import { Transactions } from "./Transactions";

describe("Transactions", () => {
	it("should render with", () => {
		const { container } = renderWithRouter(<Transactions fetchMoreAction={() => console.log("fetchMoreAction")} />);

		expect(container).toMatchSnapshot();
	});

	it("should render with custom title", () => {
		const { container } = renderWithRouter(
			<Transactions title="Transaction history" fetchMoreAction={() => console.log("fetchMoreAction")} />,
		);

		expect(container).toMatchSnapshot();
	});

	it("should render with transactions", () => {
		jest.spyOn(DelegateMapper, "execute").mockImplementation((wallet, votes) =>
			votes.map(
				(vote: string, index: number) =>
					new ReadOnlyWallet({
						address: vote,
						username: `delegate-${index}`,
					}),
			),
		);

		const { container } = renderWithRouter(
			<Transactions transactions={transactions} fetchMoreAction={() => console.log("fetchMoreAction")} />,
		);

		expect(container).toMatchSnapshot();
	});
});
