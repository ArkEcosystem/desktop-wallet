import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import nock from "nock";
import React from "react";
import coldWalletFixture from "tests/fixtures/coins/ark/wallets/DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq2P.json";
import { act, env, fireEvent, getDefaultProfileId, render, screen, waitFor } from "utils/testing-library";

import { AddParticipant } from "./AddParticipant";

describe("Add Participant", () => {
	let profile: Profile;
	let wallet: ReadWriteWallet;

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();
	});

	it("should fail to find", async () => {
		nock("https://dwallets.ark.io").post("/api/wallets/search").reply(404);
		const { asFragment } = render(<AddParticipant profile={profile} wallet={wallet} />);

		act(() => {
			fireEvent.input(screen.getByRole("textbox"), {
				target: {
					value: "D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib",
				},
			});
		});

		act(() => {
			fireEvent.click(screen.getByText("Add Link"));
		});

		await waitFor(() => expect(screen.queryByText("Failed to find")).toBeInTheDocument());

		expect(asFragment()).toMatchSnapshot();
	});

	it("should fail with cold wallet", async () => {
		nock("https://dwallets.ark.io")
			.post("/api/wallets/search")
			.reply(200, {
				meta: { count: 1, pageCount: 1, totalCount: 1 },
				data: [coldWalletFixture.data],
			});

		const { asFragment } = render(<AddParticipant profile={profile} wallet={wallet} />);

		act(() => {
			fireEvent.input(screen.getByRole("textbox"), {
				target: {
					value: "DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq2P",
				},
			});
		});

		act(() => {
			fireEvent.click(screen.getByText("Add Link"));
		});

		await waitFor(() => expect(screen.queryByText("Not found Public Key")).toBeInTheDocument());

		expect(asFragment()).toMatchSnapshot();
	});
});
