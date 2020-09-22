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
			fireEvent.click(screen.getByText(transactionTranslations.MULTISIGNATURE.ADD_PARTICIPANT));
		});

		await waitFor(() =>
			expect(
				screen.queryByText(transactionTranslations.MULTISIGNATURE.ERROR.ADDRESS_NOT_FOUND),
			).toBeInTheDocument(),
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
			fireEvent.click(screen.getByText(transactionTranslations.MULTISIGNATURE.ADD_PARTICIPANT));
		});

		await waitFor(() =>
			expect(
				screen.queryByText(transactionTranslations.MULTISIGNATURE.ERROR.PUBLIC_KEY_NOT_FOUND),
			).toBeInTheDocument(),
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should fail with a duplicate address", async () => {
		render(
			<AddParticipant
				profile={profile}
				wallet={wallet}
				defaultParticipants={[
					{
						address: wallet.address(),
						publicKey: wallet.publicKey()!,
						balance: wallet.balance().toString(),
					},
				]}
			/>,
		);

		act(() => {
			fireEvent.input(screen.getByRole("textbox"), {
				target: {
					value: wallet.address(),
				},
			});
		});

		act(() => {
			fireEvent.click(screen.getByText(transactionTranslations.MULTISIGNATURE.ADD_PARTICIPANT));
		});

		await waitFor(() =>
			expect(
				screen.queryByText(transactionTranslations.MULTISIGNATURE.ERROR.ADDRESS_ALREADY_ADDED),
			).toBeInTheDocument(),
		);
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
			fireEvent.click(screen.getByText(transactionTranslations.MULTISIGNATURE.ADD_PARTICIPANT));
		});

		await waitFor(() =>
			expect(
				screen.queryByText(transactionTranslations.MULTISIGNATURE.ERROR.ADDRESS_NOT_FOUND),
			).toBeInTheDocument(),
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
			fireEvent.click(screen.getByText(transactionTranslations.MULTISIGNATURE.ADD_PARTICIPANT));
		});

		await waitFor(() => expect(screen.getAllByRole("row")).toHaveLength(2));
		expect(onChange).toHaveBeenCalledWith([
			{
				address: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
				balance: "3375089801",
				publicKey: "03df6cd794a7d404db4f1b25816d8976d0e72c5177d17ac9b19a92703b62cdbbbc",
			},
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
			fireEvent.click(screen.getByText(transactionTranslations.MULTISIGNATURE.ADD_PARTICIPANT));
		});

		await waitFor(() => expect(screen.getAllByRole("row")).toHaveLength(2));
		expect(scope.isDone()).toBe(true);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render custom participants", () => {
		const wallet2 = profile.wallets().last();
		const { asFragment } = render(
			<AddParticipant
				profile={profile}
				wallet={wallet}
				defaultParticipants={[
					{
						address: wallet2.address(),
						publicKey: wallet2.publicKey()!,
						balance: wallet2.balance().toString(),
					},
				]}
			/>,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should remove participant", async () => {
		const onChange = jest.fn();
		render(<AddParticipant profile={profile} wallet={wallet} onChange={onChange} />);

		await waitFor(() => expect(screen.getAllByRole("row")).toHaveLength(1));

		act(() => {
			fireEvent.click(screen.getByTestId("recipient-list__remove-recipient"));
		});

		expect(onChange).toHaveBeenNthCalledWith(3, []);
	});
});
