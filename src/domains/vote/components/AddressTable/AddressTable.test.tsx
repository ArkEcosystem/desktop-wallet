import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import nock from "nock";
import React from "react";
import { env, getDefaultProfileId, render, syncDelegates, waitFor } from "testing-library";

import { AddressTable } from "./AddressTable";

let profile: Profile;
let wallet: ReadWriteWallet;

describe("AddressTable", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");

		nock.disableNetConnect();

		nock("https://dwallets.ark.io")
			.get("/api/delegates")
			.query({ page: "1" })
			.reply(200, require("tests/fixtures/coins/ark/devnet/delegates.json"))
			.persist();

		await syncDelegates();
		await wallet.syncVotes();
	});

	it("should render", async () => {
		const { asFragment, container, getByTestId } = render(<AddressTable wallets={[wallet]} />);

		expect(container).toBeTruthy();
		await waitFor(() => expect(getByTestId("AddressRow__status")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render when the maximum votes is greater than 1", () => {
		const maxVotesMock = jest.spyOn(wallet.network(), "maximumVotesPerWallet").mockReturnValue(10);
		const { asFragment, container } = render(<AddressTable wallets={[wallet]} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		maxVotesMock.mockRestore();
	});
});
