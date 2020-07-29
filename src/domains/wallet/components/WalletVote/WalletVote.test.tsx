import { Coins } from "@arkecosystem/platform-sdk";
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";
import React from "react";
import { act, fireEvent, render } from "testing-library";
import fixtureData from "tests/fixtures/env/storage-mainnet.json";
import { mockArkHttp, StubStorage } from "tests/mocks";

import { WalletVote } from "./WalletVote";

let votes: Coins.WalletDataCollection;

beforeAll(() => {
	mockArkHttp();
});

describe("WalletVote", () => {
	beforeEach(async () => {
		const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
		await env.bootFromObject(fixtureData);

		const profile = env.profiles().all()[0];
		const wallet = profile.wallets().values()[0];

		votes = (await wallet.delegates()).data;
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
		expect(getAllByTestId("WalletVote__delegate")).toHaveLength(votes.all().length);
	});

	it("should emit action on unvote", () => {
		const onUnvote = jest.fn();
		const { getAllByTestId } = render(<WalletVote onUnvote={onUnvote} votes={votes} />);
		const unvoteButtons = getAllByTestId("WalletVote__delegate__unvote");
		expect(unvoteButtons).toHaveLength(votes.all().length);
		act(() => {
			fireEvent.click(unvoteButtons[0]);
		});
		expect(onUnvote).toHaveBeenCalledWith(votes.all()[0].address());
	});
});
