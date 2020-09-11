import { ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render } from "testing-library";

import { WalletVote } from "./WalletVote";

let wallet: ReadWriteWallet;
let votes: ReadOnlyWallet[];

describe("WalletVote", () => {
	beforeEach(() => {
		const profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");

		votes = [
			new ReadOnlyWallet({
				address: wallet.address(),
				explorerLink: "",
				publicKey: wallet.publicKey(),
				username: "arkx",
				rank: 1,
			}),
		];
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

	it("should render if a delegate is missing its rank", () => {
		const { getByTestId, asFragment } = render(
			<WalletVote
				votes={[
					new ReadOnlyWallet({
						address: wallet.address(),
						explorerLink: "",
						publicKey: wallet.publicKey(),
						username: "arkx",
						rank: undefined,
					}),
				]}
			/>,
		);

		expect(getByTestId("WalletVote")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without votes", () => {
		const { getByTestId, asFragment } = render(<WalletVote />);
		expect(getByTestId("WalletVote__empty")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a single vote", () => {
		const { getAllByTestId, getByText } = render(<WalletVote votes={votes} />);
		expect(getAllByTestId("Avatar")).toHaveLength(1);
		expect(getByText(votes[0].username())).toBeTruthy();
	});

	it("should render multiple votes", () => {
		const { getAllByTestId, getByText } = render(<WalletVote votes={[...votes, ...votes]} />);

		expect(getAllByTestId("Avatar")).toHaveLength(2);
		expect(() => getByText(votes[0].username())).toThrow(/Unable to find an element/);
	});

	it("should emit action on button (unvote)", () => {
		const onUnvote = jest.fn();

		const { getByTestId } = render(<WalletVote onUnvote={onUnvote} votes={votes} />);

		act(() => {
			fireEvent.click(getByTestId("WalletVote__button"));
		});

		expect(onUnvote).toHaveBeenCalledWith(votes[0].address());
	});

	it("should emit action on button (show all)", () => {
		const onUnvote = jest.fn();

		const { getByTestId } = render(<WalletVote onUnvote={onUnvote} votes={[...votes, ...votes]} />);

		act(() => {
			fireEvent.click(getByTestId("WalletVote__button"));
		});

		expect(onUnvote).toHaveBeenCalledWith();
	});
});
