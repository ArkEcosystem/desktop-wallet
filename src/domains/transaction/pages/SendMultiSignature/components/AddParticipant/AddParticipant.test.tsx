import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { translations as transactionTranslations } from "domains/transaction/i18n";
import nock from "nock";
import React from "react";
import walletFixture from "tests/fixtures/coins/ark/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib.json";
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

		await waitFor(() =>
			expect(screen.queryByText(transactionTranslations.INPUT_MULTISIG.ADDRESS_NOT_FOUND)).toBeInTheDocument(),
		);

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

		await waitFor(() =>
			expect(screen.queryByText(transactionTranslations.INPUT_MULTISIG.PUBLIC_KEY_NOT_FOUND)).toBeInTheDocument(),
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should fail if cannot find the address remotely", async () => {
		nock("https://dwallets.ark.io")
			.post("/api/wallets/search")
			.reply(200, {
				meta: { count: 0, pageCount: 1, totalCount: 0 },
				data: [],
			});

		const { asFragment } = render(<AddParticipant profile={profile} wallet={wallet} />);

		act(() => {
			fireEvent.input(screen.getByRole("textbox"), {
				target: {
					value: "DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq20",
				},
			});
		});

		act(() => {
			fireEvent.click(screen.getByText("Add Link"));
		});

		await waitFor(() =>
			expect(screen.queryByText(transactionTranslations.INPUT_MULTISIG.ADDRESS_NOT_FOUND)).toBeInTheDocument(),
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should work with an imported wallet", async () => {
		const onChange = jest.fn();
		const { asFragment } = render(<AddParticipant profile={profile} wallet={wallet} onChange={onChange} />);

		act(() => {
			fireEvent.input(screen.getByRole("textbox"), {
				target: {
					value: profile.wallets().last().address(),
				},
			});
		});

		act(() => {
			fireEvent.click(screen.getByText("Add Link"));
		});

		await waitFor(() => expect(screen.getAllByRole("row")).toHaveLength(1));
		expect(onChange).toHaveBeenCalledWith([
			{
				address: "D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb",
				publicKey: "03af2feb4fc97301e16d6a877d5b135417e8f284d40fac0f84c09ca37f82886c51",
				balance: "5768000000",
			},
		]);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should work with a remote wallet", async () => {
		const scope = nock("https://dwallets.ark.io")
			.post("/api/wallets/search")
			.reply(200, {
				meta: { count: 1, pageCount: 1, totalCount: 1 },
				data: [walletFixture.data],
			});

		const { asFragment } = render(<AddParticipant profile={profile} wallet={wallet} />);

		act(() => {
			fireEvent.input(screen.getByRole("textbox"), {
				target: {
					value: walletFixture.data.address,
				},
			});
		});

		act(() => {
			fireEvent.click(screen.getByText("Add Link"));
		});

		await waitFor(() => expect(screen.getAllByRole("row")).toHaveLength(1));
		expect(scope.isDone()).toBe(true);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should remove participant", async () => {
		const onChange = jest.fn();
		render(<AddParticipant profile={profile} wallet={wallet} onChange={onChange} />);

		act(() => {
			fireEvent.input(screen.getByRole("textbox"), {
				target: {
					value: profile.wallets().last().address(),
				},
			});
		});

		act(() => {
			fireEvent.click(screen.getByText("Add Link"));
		});

		await waitFor(() => expect(screen.getAllByRole("row")).toHaveLength(1));

		act(() => {
			fireEvent.click(screen.getByTestId("recipient-list__remove-recipient"));
		});

		expect(onChange).toHaveBeenNthCalledWith(3, []);
	});
});
