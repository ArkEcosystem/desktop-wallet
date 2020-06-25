import { act, fireEvent, render } from "@testing-library/react";
import React from "react";

import { WalletVote } from "./WalletVote";

describe("WalletVote", () => {
	const data = [
		{
			username: "Test",
			address: "test1",
			rank: 1,
			explorerUrl: "https://dexplorer.ark.io",
			msqUrl: "https://marketsquare.ark.io",
			isActive: true,
		},
		{
			username: "Test 2",
			address: "test2",
			rank: 2,
		},
	];

	it("should render", () => {
		const { getByTestId, asFragment } = render(<WalletVote delegates={data} />);
		expect(getByTestId("WalletVote")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render closed", () => {
		const { getByTestId } = render(<WalletVote delegates={data} defaultIsOpen={false} />);
		expect(getByTestId("Collapse")).toHaveAttribute("aria-hidden", "true");
	});

	it("should toggle", () => {
		const { getByTestId } = render(<WalletVote delegates={data} />);
		act(() => {
			fireEvent.click(getByTestId("WalletVote__toggle"));
		});
		expect(getByTestId("Collapse")).toHaveAttribute("aria-hidden", "true");
	});

	it("should render delegates", () => {
		const { getAllByTestId } = render(<WalletVote delegates={data} />);
		expect(getAllByTestId("WalletVote__delegate")).toHaveLength(data.length);
	});

	it("should emit action on unvote", () => {
		const onUnvote = jest.fn();
		const { getAllByTestId } = render(<WalletVote onUnvote={onUnvote} delegates={data} />);
		const unvoteButtons = getAllByTestId("WalletVote__delegate__unvote");
		expect(unvoteButtons).toHaveLength(data.length);
		act(() => {
			fireEvent.click(unvoteButtons[0]);
		});
		expect(onUnvote).toHaveBeenCalledWith(data[0].address);
	});
});
