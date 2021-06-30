import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { renderHook } from "@testing-library/react-hooks";
import { translations as transactionTranslations } from "domains/transaction/i18n";
import nock from "nock";
import React from "react";
import { useTranslation } from "react-i18next";
import walletFixture from "tests/fixtures/coins/ark/devnet/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib.json";
import coldWalletFixture from "tests/fixtures/coins/ark/devnet/wallets/DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq2P.json";
import { env, fireEvent, getDefaultProfileId, render, screen, waitFor } from "utils/testing-library";

import { AddParticipant } from "./AddParticipant";

let t: any;

describe("Add Participant", () => {
	let profile: Contracts.IProfile;
	let wallet: Contracts.IReadWriteWallet;
	let wallet2: Contracts.IReadWriteWallet;

	beforeEach(async () => {
		const { result } = renderHook(() => useTranslation());
		t = result.current.t;

		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();
		wallet2 = profile.wallets().last();

		await profile.sync();
	});

	it("should fail to find", async () => {
		nock("https://dwallets.ark.io")
			.get("/api/wallets")
			.query({ address: "D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyiba" })
			.reply(404);
		const { asFragment } = render(<AddParticipant profile={profile} wallet={wallet} />);

		fireEvent.input(screen.getByTestId("SelectDropdown__input"), {
			target: {
				value: "D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyiba",
			},
		});

		await waitFor(() => {
			expect(screen.getByTestId("SelectDropdown__input")).toHaveValue("D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyiba");
		});

		fireEvent.click(screen.getByText(transactionTranslations.MULTISIGNATURE.ADD_PARTICIPANT));

		await waitFor(() => {
			expect(screen.getAllByTestId("Input__error")[0]).toBeVisible();
		});

		expect(screen.getAllByTestId("Input__error")[0]).toHaveAttribute(
			"data-errortext",
			t("TRANSACTION.MULTISIGNATURE.ERROR.ADDRESS_NOT_FOUND"),
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should fail with cold wallet", async () => {
		nock("https://dwallets.ark.io")
			.get("/api/wallets")
			.query({ address: "DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq2P" })
			.reply(200, {
				data: [coldWalletFixture.data],
				meta: { count: 1, pageCount: 1, totalCount: 1 },
			});

		const { asFragment } = render(<AddParticipant profile={profile} wallet={wallet} />);

		fireEvent.input(screen.getByTestId("SelectDropdown__input"), {
			target: {
				value: "DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq2P",
			},
		});

		await waitFor(() => {
			expect(screen.getByTestId("SelectDropdown__input")).toHaveValue("DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq2P");
		});

		fireEvent.click(screen.getByText(transactionTranslations.MULTISIGNATURE.ADD_PARTICIPANT));

		await waitFor(() => {
			expect(screen.getAllByTestId("Input__error")[0]).toBeVisible();
		});

		expect(screen.getAllByTestId("Input__error")[0]).toHaveAttribute(
			"data-errortext",
			t("TRANSACTION.MULTISIGNATURE.ERROR.PUBLIC_KEY_NOT_FOUND"),
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should fail with a duplicate address", async () => {
		const { asFragment } = render(
			<AddParticipant
				profile={profile}
				wallet={wallet}
				defaultParticipants={[
					{
						address: wallet.address(),
						balance: wallet.balance().toString(),
						publicKey: wallet.publicKey()!,
					},
				]}
			/>,
		);

		fireEvent.input(screen.getByTestId("SelectDropdown__input"), {
			target: {
				value: wallet.address(),
			},
		});

		await waitFor(() => {
			expect(screen.getByTestId("SelectDropdown__input")).toHaveValue(wallet.address());
		});

		fireEvent.click(screen.getByText(transactionTranslations.MULTISIGNATURE.ADD_PARTICIPANT));

		await waitFor(() => {
			expect(screen.getAllByTestId("Input__error")[0]).toBeVisible();
		});

		expect(screen.getAllByTestId("Input__error")[0]).toHaveAttribute(
			"data-errortext",
			t("TRANSACTION.MULTISIGNATURE.ERROR.ADDRESS_ALREADY_ADDED"),
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should fail if cannot find the address remotely", async () => {
		nock("https://dwallets.ark.io")
			.get("/api/wallets")
			.query({ address: "DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq20" })
			.reply(200, {
				data: [],
				meta: { count: 0, pageCount: 1, totalCount: 0 },
			});

		const { asFragment } = render(<AddParticipant profile={profile} wallet={wallet} />);

		fireEvent.input(screen.getByTestId("SelectDropdown__input"), {
			target: {
				value: "DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq20",
			},
		});

		await waitFor(() => {
			expect(screen.getByTestId("SelectDropdown__input")).toHaveValue("DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq20");
		});

		fireEvent.click(screen.getByText(transactionTranslations.MULTISIGNATURE.ADD_PARTICIPANT));

		await waitFor(() => {
			expect(screen.getAllByTestId("Input__error")[0]).toBeVisible();
		});

		expect(screen.getAllByTestId("Input__error")[0]).toHaveAttribute(
			"data-errortext",
			t("TRANSACTION.MULTISIGNATURE.ERROR.ADDRESS_NOT_FOUND"),
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should work with an imported wallet", async () => {
		const onChange = jest.fn();
		const { asFragment } = render(<AddParticipant profile={profile} wallet={wallet} onChange={onChange} />);

		fireEvent.input(screen.getByTestId("SelectDropdown__input"), {
			target: {
				value: profile.wallets().last().address(),
			},
		});

		fireEvent.click(screen.getByText(transactionTranslations.MULTISIGNATURE.ADD_PARTICIPANT));

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
			.query((parameters) => !!parameters.address)
			.reply(200, {
				data: [walletFixture.data],
				meta: { count: 1, pageCount: 1, totalCount: 1 },
			});

		const { asFragment } = render(<AddParticipant profile={profile} wallet={wallet} />);

		fireEvent.input(screen.getByTestId("SelectDropdown__input"), {
			target: {
				value: walletFixture.data.address,
			},
		});

		fireEvent.click(screen.getByText(transactionTranslations.MULTISIGNATURE.ADD_PARTICIPANT));

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

		expect(screen.getAllByTestId("recipient-list__remove-recipient")[1]).not.toBeDisabled();
		fireEvent.click(screen.getAllByTestId("recipient-list__remove-recipient")[1]);

		expect(onChange).toHaveBeenCalledWith([
			{
				address: wallet.address(),
				publicKey: wallet.publicKey()!,
			},
		]);
	});

	it("should not remove own address", async () => {
		render(<AddParticipant profile={profile} wallet={wallet} />);

		await waitFor(() => expect(screen.getAllByRole("row")).toHaveLength(1));

		expect(screen.getByTestId("recipient-list__remove-recipient")).toBeDisabled();
		fireEvent.click(screen.getByTestId("recipient-list__remove-recipient"));

		await waitFor(() => expect(screen.getAllByRole("row")).toHaveLength(1));
	});
});
