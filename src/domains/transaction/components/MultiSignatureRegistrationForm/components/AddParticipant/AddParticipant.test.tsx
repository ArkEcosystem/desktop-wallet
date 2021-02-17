import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { translations as transactionTranslations } from "domains/transaction/i18n";
import nock from "nock";
import React from "react";
import walletFixture from "tests/fixtures/coins/ark/devnet/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib.json";
import coldWalletFixture from "tests/fixtures/coins/ark/devnet/wallets/DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq2P.json";
import { act, env, fireEvent, getDefaultProfileId, render, screen, waitFor } from "utils/testing-library";

import { AddParticipant } from "./AddParticipant";

describe("Add Participant", () => {
	let profile: Profile;
	let wallet: ReadWriteWallet;
	let wallet2: ReadWriteWallet;

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();
		wallet2 = profile.wallets().last();
	});

	it("should fail to find", async () => {
		nock("https://dwallets.ark.io")
			.get("/api/wallets")
			.query({ address: "D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyiba" })
			.reply(404);
		const { asFragment } = render(<AddParticipant profile={profile} wallet={wallet} />);

		act(() => {
			fireEvent.input(screen.getByTestId("SelectDropdownInput__input"), {
				target: {
					value: "D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyiba",
				},
			});
		});

		act(() => {
			fireEvent.click(screen.getByText(transactionTranslations.MULTISIGNATURE.ADD_PARTICIPANT));
		});

		await waitFor(() => {
			const input = screen.getByTestId("SelectDropdownInput__input");
			expect(input).toHaveAttribute("aria-invalid");
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should fail with cold wallet", async () => {
		nock("https://dwallets.ark.io")
			.get("/api/wallets")
			.query({ address: "DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq2P" })
			.reply(200, {
				meta: { count: 1, pageCount: 1, totalCount: 1 },
				data: [coldWalletFixture.data],
			});

		const { asFragment } = render(<AddParticipant profile={profile} wallet={wallet} />);

		act(() => {
			fireEvent.input(screen.getByTestId("SelectDropdownInput__input"), {
				target: {
					value: "DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq2P",
				},
			});
		});

		act(() => {
			fireEvent.click(screen.getByText(transactionTranslations.MULTISIGNATURE.ADD_PARTICIPANT));
		});

		await waitFor(() => {
			const input = screen.getByTestId("SelectDropdownInput__input");
			expect(input).toHaveAttribute("aria-invalid");
		});

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
			fireEvent.input(screen.getByTestId("SelectDropdownInput__input"), {
				target: {
					value: wallet.address(),
				},
			});
		});

		act(() => {
			fireEvent.click(screen.getByText(transactionTranslations.MULTISIGNATURE.ADD_PARTICIPANT));
		});

		await waitFor(() => {
			const input = screen.getByTestId("SelectDropdownInput__input");
			expect(input).toHaveAttribute("aria-invalid");
		});
	});

	it("should fail if cannot find the address remotely", async () => {
		nock("https://dwallets.ark.io")
			.get("/api/wallets")
			.query({ address: "DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq20" })
			.reply(200, {
				meta: { count: 0, pageCount: 1, totalCount: 0 },
				data: [],
			});

		const { asFragment } = render(<AddParticipant profile={profile} wallet={wallet} />);

		act(() => {
			fireEvent.input(screen.getByTestId("SelectDropdownInput__input"), {
				target: {
					value: "DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq20",
				},
			});
		});

		act(() => {
			fireEvent.click(screen.getByText(transactionTranslations.MULTISIGNATURE.ADD_PARTICIPANT));
		});

		await waitFor(() => {
			const input = screen.getByTestId("SelectDropdownInput__input");
			expect(input).toHaveAttribute("aria-invalid");
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should work with an imported wallet", async () => {
		const onChange = jest.fn();
		const { asFragment } = render(<AddParticipant profile={profile} wallet={wallet} onChange={onChange} />);

		act(() => {
			fireEvent.input(screen.getByTestId("SelectDropdownInput__input"), {
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
				publicKey: "03df6cd794a7d404db4f1b25816d8976d0e72c5177d17ac9b19a92703b62cdbbbc",
			},
			{
				address: "D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb",
				publicKey: "03af2feb4fc97301e16d6a877d5b135417e8f284d40fac0f84c09ca37f82886c51",
			},
		]);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should work with a remote wallet", async () => {
		const scope = nock("https://dwallets.ark.io")
			.get("/api/wallets")
			.query((params) => !!params.address)
			.reply(200, {
				meta: { count: 1, pageCount: 1, totalCount: 1 },
				data: [walletFixture.data],
			});

		const { asFragment } = render(<AddParticipant profile={profile} wallet={wallet} />);

		act(() => {
			fireEvent.input(screen.getByTestId("SelectDropdownInput__input"), {
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
		const { asFragment } = render(
			<AddParticipant
				profile={profile}
				wallet={wallet}
				defaultParticipants={[
					{
						address: wallet2.address(),
						publicKey: wallet2.publicKey()!,
					},
				]}
			/>,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should remove participant", async () => {
		const onChange = jest.fn();
		render(
			<AddParticipant
				profile={profile}
				wallet={wallet}
				onChange={onChange}
				defaultParticipants={[
					{
						address: wallet.address(),
						publicKey: wallet.publicKey()!,
					},
					{
						address: wallet2.address(),
						publicKey: wallet2.publicKey()!,
					},
				]}
			/>,
		);

		await waitFor(() => expect(screen.getAllByRole("row")).toHaveLength(2));

		act(() => {
			fireEvent.click(screen.getAllByTestId("recipient-list__remove-recipient")[1]);
		});

		expect(onChange).toHaveBeenCalledWith([
			{
				address: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
				publicKey: "03df6cd794a7d404db4f1b25816d8976d0e72c5177d17ac9b19a92703b62cdbbbc",
			},
		]);
	});

	it("should not remove own address", async () => {
		render(<AddParticipant profile={profile} wallet={wallet} />);

		await waitFor(() => expect(screen.getAllByRole("row")).toHaveLength(1));

		act(() => {
			fireEvent.click(screen.getByTestId("recipient-list__remove-recipient"));
		});

		await waitFor(() => expect(screen.getAllByRole("row")).toHaveLength(1));
	});
});
