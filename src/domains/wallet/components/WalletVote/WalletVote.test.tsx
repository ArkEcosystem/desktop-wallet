import { Coins } from "@arkecosystem/platform-sdk";
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";
import React from "react";
import { act, fireEvent, render } from "testing-library";
import fixtureData from "tests/fixtures/env/storage-mainnet.json";
import { mockArkHttp, StubStorage } from "tests/mocks";

import { WalletVote } from "./WalletVote";

let delegates: Coins.WalletDataCollection;

beforeAll(() => {
	mockArkHttp();
});

describe("WalletVote", () => {
	beforeEach(async () => {
		const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
		await env.bootFromObject(fixtureData);

		const profile = env.profiles().all()[0];
		const wallet = profile.wallets().values()[0];

		delegates = (await wallet.delegates()).data;
	});

	it("should render", () => {
		const { getByTestId, asFragment } = render(<WalletVote delegates={delegates} />);
		expect(getByTestId("WalletVote")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without delegates", () => {
		const { getByTestId, asFragment } = render(<WalletVote />);
		expect(getByTestId("WalletVote__empty")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render closed", () => {
		const { getByTestId } = render(<WalletVote delegates={delegates} defaultIsOpen={false} />);
		expect(getByTestId("Collapse")).toHaveAttribute("aria-hidden", "true");
	});

	it("should toggle", () => {
		const { getByTestId } = render(<WalletVote delegates={delegates} />);
		act(() => {
			fireEvent.click(getByTestId("WalletVote__toggle"));
		});
		expect(getByTestId("Collapse")).toHaveAttribute("aria-hidden", "true");
	});

	it("should render delegates", () => {
		const { getAllByTestId } = render(<WalletVote delegates={delegates} />);
		expect(getAllByTestId("WalletVote__delegate")).toHaveLength(delegates.all().length);
	});

	it("should emit action on unvote", () => {
		const onUnvote = jest.fn();
		const { getAllByTestId } = render(<WalletVote onUnvote={onUnvote} delegates={delegates} />);
		const unvoteButtons = getAllByTestId("WalletVote__delegate__unvote");
		expect(unvoteButtons).toHaveLength(delegates.all().length);
		act(() => {
			fireEvent.click(unvoteButtons[0]);
		});
		expect(onUnvote).toHaveBeenCalledWith(delegates.all()[0].address());
	});
});
