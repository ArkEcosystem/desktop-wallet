import { Coins } from "@arkecosystem/platform-sdk";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render } from "testing-library";

import { WalletVote } from "./WalletVote";

let votes: Coins.WalletDataCollection;

describe("WalletVote", () => {
	beforeEach(async () => {
		const profile = env.profiles().findById(getDefaultProfileId());
		const wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");

		votes = await wallet.delegates();
	});

	it("should render", () => {
		const { getByTestId, asFragment } = render(<WalletVote votes={votes} />);
		expect(getByTestId("WalletVote")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without votes", () => {
		const { getByTestId, asFragment } = render(<WalletVote />);
		expect(getByTestId("WalletVote__empty")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render closed", () => {
		const { getByTestId } = render(<WalletVote votes={votes} defaultIsOpen={false} />);
		expect(getByTestId("Collapse")).toHaveAttribute("aria-hidden", "true");
	});

	it("should toggle", () => {
		const { getByTestId } = render(<WalletVote votes={votes} />);
		act(() => {
			fireEvent.click(getByTestId("WalletVote__toggle"));
		});
		expect(getByTestId("Collapse")).toHaveAttribute("aria-hidden", "true");
	});

	it("should render votes", () => {
		const { getAllByTestId } = render(<WalletVote votes={votes} />);
		expect(getAllByTestId("WalletVote__delegate")).toHaveLength(votes.items().length);
	});

	it("should emit action on unvote", () => {
		const onUnvote = jest.fn();
		const { getAllByTestId } = render(<WalletVote onUnvote={onUnvote} votes={votes} />);
		const unvoteButtons = getAllByTestId("WalletVote__delegate__unvote");
		expect(unvoteButtons).toHaveLength(votes.items().length);
		act(() => {
			fireEvent.click(unvoteButtons[0]);
		});
		expect(onUnvote).toHaveBeenCalledWith(votes.items()[0].address());
	});
});
