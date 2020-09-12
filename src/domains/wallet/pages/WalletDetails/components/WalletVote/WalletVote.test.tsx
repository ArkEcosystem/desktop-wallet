import { ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, syncDelegates } from "testing-library";

import { WalletVote } from "./WalletVote";

let wallet: ReadWriteWallet;
let votes: ReadOnlyWallet[];

describe("WalletVote", () => {
	beforeEach(async () => {
		const profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");

		await syncDelegates();
		await wallet.syncVotes();

		votes = wallet.votes();
	});

	it("should render", () => {
		const { getByTestId, asFragment } = render(<WalletVote votes={votes} />);
		expect(getByTestId("WalletVote")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render loading state", () => {
		const { getByTestId, asFragment } = render(<WalletVote votes={votes} isLoading={true} />);

		expect(getByTestId("WalletVote__skeleton")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without votes", () => {
		const { asFragment, getByTestId, getByText } = render(<WalletVote />);
		expect(getByTestId("WalletVote__empty")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render the maximum votes", () => {
		const { asFragment, getByText } = render(<WalletVote maxVotes={101} />);
		expect(getByText("(0/101)")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a single vote", () => {
		const { getAllByTestId, getByText } = render(
			<WalletVote
				votes={[
					new ReadOnlyWallet({
						address: wallet.address(),
						explorerLink: "",
						publicKey: wallet.publicKey(),
						username: "arkx",
						rank: 1,
					}),
				]}
			/>,
		);

		expect(getByText("ok.svg")).toBeTruthy();
		expect(getAllByTestId("Avatar")).toHaveLength(1);
		expect(getByText(votes[0].username())).toBeTruthy();
	});

	it.each([2, 3, 4])("should render multiple votes", (count) => {
		const { asFragment, getAllByTestId, getByText } = render(
			<WalletVote votes={new Array(count).fill(...votes)} />,
		);

		if (count < 4) {
			expect(getAllByTestId("Avatar")).toHaveLength(count);
		} else {
			expect(getByText("+2")).toBeTruthy();
		}

		expect(() => getByText(votes[0].username())).toThrow(/Unable to find an element/);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should emit action on button (unvote)", () => {
		const onButtonClick = jest.fn();

		const { getByTestId } = render(<WalletVote onButtonClick={onButtonClick} votes={votes} />);

		act(() => {
			fireEvent.click(getByTestId("WalletVote__button"));
		});

		expect(onButtonClick).toHaveBeenCalledWith(votes[0].address());
	});

	it("should emit action on button (show all)", () => {
		const onButtonClick = jest.fn();

		const { getByTestId } = render(<WalletVote onButtonClick={onButtonClick} votes={[...votes, ...votes]} />);

		act(() => {
			fireEvent.click(getByTestId("WalletVote__button"));
		});

		expect(onButtonClick).toHaveBeenCalledWith();
	});
});
