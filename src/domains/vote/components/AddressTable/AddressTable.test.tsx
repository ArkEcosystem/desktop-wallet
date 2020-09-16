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
			.reply(200, require("tests/fixtures/coins/ark/delegates-devnet.json"))
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

	it("should render with empty list", () => {
		const { asFragment, container } = render(<AddressTable wallets={[]} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
