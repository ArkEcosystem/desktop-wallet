/* eslint-disable @typescript-eslint/require-await */
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { httpClient } from "app/services";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { Route } from "react-router-dom";
import { toast } from "react-toastify";
import EntityUpdateTransactionFixture from "tests/fixtures/coins/ark/transactions/entity-update.json";
import IpfsFixture from "tests/fixtures/ipfs/QmRwgWaaEyYgGqp55196TsFDQLW4NZkyTnPwiSVhJ7NPRV.json";
import BusinessEntities from "tests/fixtures/registrations/businesses.json";
import {
	act,
	defaultNetMocks,
	env,
	fireEvent,
	getDefaultProfileId,
	getDefaultWalletId,
	renderWithRouter,
	syncDelegates,
	syncFees,
	waitFor,
} from "utils/testing-library";

import { SendEntityUpdate } from "../SendEntityUpdate";

const BusinessTransactionsFixture = BusinessEntities.data[0];

const defaultFormValues = {
	onDownload: jest.fn(),
};

const renderPage = (url?: string | undefined) => {
	const history = createMemoryHistory();
	const transactionId = "df520b0a278314e998dc93be1e20c72b8313950c19da23967a9db60eb4e990da";
	const updateRegistrationURL =
		url ||
		`/profiles/${getDefaultProfileId()}/wallets/${getDefaultWalletId()}/transactions/${transactionId}/send-entity-update`;

	history.push(updateRegistrationURL);

	return renderWithRouter(
		<Route path="/profiles/:profileId/wallets/:walletId/transactions/:transactionId/send-entity-update">
			<SendEntityUpdate {...defaultFormValues} />
		</Route>,
		{
			routes: [updateRegistrationURL],
			history,
		},
	);
};

let wallet: ReadWriteWallet;
let profile: Profile;

const createTransactionMock = (wallet: ReadWriteWallet) =>
	// @ts-ignore
	jest.spyOn(wallet.transaction(), "transaction").mockReturnValue({
		id: () => EntityUpdateTransactionFixture.data.id,
		sender: () => EntityUpdateTransactionFixture.data.sender,
		recipient: () => EntityUpdateTransactionFixture.data.recipient,
		amount: () => BigNumber.make(EntityUpdateTransactionFixture.data.amount),
		fee: () => BigNumber.make(EntityUpdateTransactionFixture.data.fee),
		data: () => EntityUpdateTransactionFixture.data,
	});

describe("SendEntityUpdate", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById(getDefaultWalletId());

		await syncDelegates();
		await syncFees();
	});

	beforeEach(() => {
		defaultNetMocks();

		nock("https://dwallets.ark.io")
			.get("/api/transactions/df520b0a278314e998dc93be1e20c72b8313950c19da23967a9db60eb4e990da")
			.query(true)
			.reply(200, () => ({ data: BusinessTransactionsFixture }))
			.persist();

		nock("https://platform.ark.io/api")
			.get("/ipfs/QmRwgWaaEyYgGqp55196TsFDQLW4NZkyTnPwiSVhJ7NPRV")
			.reply(200, IpfsFixture)
			.get("/ipfs/QmV1n5F9PuBE2ovW9jVfFpxyvWZxYHjSdfLrYL2nDcb1gW")
			.reply(200, IpfsFixture)
			.post("/ipfs")
			.reply(200, { data: { hash: EntityUpdateTransactionFixture.data.asset.data.ipfsData } })
			.persist();
	});

	it("should fetch and fill display name input from ipfs", async () => {
		const { getByTestId } = renderPage();

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());
		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__display-name")).toHaveValue(IpfsFixture.data.meta.displayName),
		);
	});

	it("should fetch and fill entity description input from ipfs", async () => {
		const { getByTestId } = renderPage();

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());
		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__description")).toHaveValue(IpfsFixture.data.meta.description),
		);
	});

	it("should fetch and fill entity website input from ipfs", async () => {
		const { getByTestId } = renderPage();

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());
		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__website")).toHaveValue(IpfsFixture.data.meta.website),
		);
	});

	it("should fetch and render sourceControl links collection from ipfs", async () => {
		const { getByTestId, getAllByTestId } = renderPage();

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());
		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__display-name")).toHaveValue(
				BusinessTransactionsFixture.asset.data.name,
			),
		);

		const sourcesLinkCollection = getAllByTestId("LinkCollection__header")[0];
		expect(sourcesLinkCollection).toBeTruthy();
		act(() => {
			fireEvent.click(sourcesLinkCollection);
		});

		await waitFor(() => expect(getAllByTestId("LinkCollection__remove-link")).toHaveLength(4));
	});

	it("should fetch and render socialMedia links collection from ipfs", async () => {
		const { getByTestId, getAllByTestId } = renderPage();

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());
		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__display-name")).toHaveValue(
				BusinessTransactionsFixture.asset.data.name,
			),
		);

		const sourcesLinkCollection = getAllByTestId("LinkCollection__header")[1];
		expect(sourcesLinkCollection).toBeTruthy();
		act(() => {
			fireEvent.click(sourcesLinkCollection);
		});

		await waitFor(() => expect(getAllByTestId("LinkCollection__remove-link")).toHaveLength(11));
	});

	it("should render with empty link collections", async () => {
		nock.cleanAll();
		httpClient.clearCache();

		nock("https://dwallets.ark.io")
			.get("/api/transactions/df520b0a278314e998dc93be1e20c72b8313950c19da23967a9db60eb4e990da")
			.query(true)
			.reply(200, () => ({ data: BusinessTransactionsFixture }));

		const ipfsFixtureEmptyResources = {
			data: {
				sourceControl: undefined,
				socialMedia: undefined,
				videos: undefined,
				images: undefined,
				meta: { displayName: "business2reg", description: "Testing", website: "https://ark.io/" },
			},
		};

		nock("https://platform.ark.io/api")
			.get("/ipfs/QmRwgWaaEyYgGqp55196TsFDQLW4NZkyTnPwiSVhJ7NPRV")
			.reply(200, ipfsFixtureEmptyResources);

		const { getByTestId } = renderPage();

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());
		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__display-name")).toHaveValue(
				BusinessTransactionsFixture.asset.data.name,
			),
		);
	});

	it("should fetch and render fees for entity update", async () => {
		const { getByTestId } = renderPage();

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());
		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__display-name")).toHaveValue(
				BusinessTransactionsFixture.asset.data.name,
			),
		);

		const feeInput = getByTestId("InputCurrency");
		await waitFor(() => expect(feeInput).toHaveValue("0"));
	});

	it("should update fee", async () => {
		const { getByTestId, getAllByTestId } = renderPage();

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());
		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__display-name")).toHaveValue(
				BusinessTransactionsFixture.asset.data.name,
			),
		);

		const feeInput = getByTestId("InputCurrency");

		await waitFor(() => expect(feeInput).toHaveValue("0"));

		act(() => {
			fireEvent.click(getAllByTestId("SelectionBarOption")[0]);
		});

		await waitFor(() => expect(feeInput).toHaveValue("0"));
	});

	it("should fetch and render fees for entity update", async () => {
		const { getByTestId } = renderPage();

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());
		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__display-name")).toHaveValue(
				BusinessTransactionsFixture.asset.data.name,
			),
		);
		const feeInput = getByTestId("InputCurrency");

		await waitFor(() => expect(feeInput).toHaveValue("0"));
	});

	it("should throw error if transaction is not found and show error in toast", async () => {
		const toastMock = jest.spyOn(toast, "error");
		const wrongTxUrl = `/profiles/${getDefaultProfileId()}/wallets/${getDefaultWalletId()}/transactions/abc/send-entity-update`;
		renderPage(wrongTxUrl);

		await waitFor(() =>
			expect(toastMock).toHaveBeenCalledWith("Unable to find transaction for [abc]", expect.anything()),
		);

		toastMock.mockRestore();
	});

	it("should throw error if ipfs data is not fetched and show error in toast", async () => {
		nock.cleanAll();
		httpClient.clearCache();

		nock("https://dwallets.ark.io")
			.get("/api/transactions/df520b0a278314e998dc93be1e20c72b8313950c19da23967a9db60eb4e990da")
			.query(true)
			.reply(200, () => ({ data: BusinessTransactionsFixture }))
			.persist();

		nock("https://platform.ark.io/api").get("/ipfs/QmRwgWaaEyYgGqp55196TsFDQLW4NZkyTnPwiSVhJ7NPRV").reply(200, {});

		const toastMock = jest.spyOn(toast, "error");
		renderPage();
		await waitFor(() => expect(toastMock).toBeCalled());

		toastMock.mockRestore();
	});

	it("should throw error if ipfs data is not fetched and show error in toast", async () => {
		nock.cleanAll();
		httpClient.clearCache();

		nock("https://dwallets.ark.io")
			.get("/api/transactions/df520b0a278314e998dc93be1e20c72b8313950c19da23967a9db60eb4e990da")
			.query(true)
			.reply(200, () => ({ data: BusinessTransactionsFixture }))
			.persist();

		nock("https://platform.ark.io/api").get("/ipfs/QmRwgWaaEyYgGqp55196TsFDQLW4NZkyTnPwiSVhJ7NPRV").reply(404, {});

		const toastMock = jest.spyOn(toast, "error");
		renderPage();
		await waitFor(() => expect(toastMock).toBeCalled());

		toastMock.mockRestore();
	});

	it("should should go back", async () => {
		const { asFragment, getByTestId } = renderPage();

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());
		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__display-name")).toHaveValue(
				BusinessTransactionsFixture.asset.data.name,
			),
		);

		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__back-button"));
		});

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should fail validation on display name input in first step", async () => {
		const { asFragment, getByTestId } = renderPage();

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());
		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__display-name")).toHaveValue(
				BusinessTransactionsFixture.asset.data.name,
			),
		);

		// Required
		act(() => {
			fireEvent.change(getByTestId("EntityRegistrationForm__display-name"), { target: { value: " " } });
		});

		act(() => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});
		//

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();

		// Min length
		act(() => {
			fireEvent.change(getByTestId("EntityRegistrationForm__display-name"), { target: { value: "ab" } });
		});

		act(() => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();

		// Max length
		act(() => {
			const longText =
				"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";
			fireEvent.change(getByTestId("EntityRegistrationForm__display-name"), { target: { value: longText } });
		});

		act(() => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});
		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should fail validation on description textarea in first step", async () => {
		const { asFragment, getByTestId } = renderPage();

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());
		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__display-name")).toHaveValue(
				BusinessTransactionsFixture.asset.data.name,
			),
		);

		// Required
		act(() => {
			fireEvent.change(getByTestId("EntityRegistrationForm__description"), { target: { value: " " } });
		});

		act(() => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();

		// Min length
		act(() => {
			fireEvent.change(getByTestId("EntityRegistrationForm__description"), { target: { value: "ab" } });
		});

		act(() => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();

		// Max length
		act(() => {
			const longText =
				"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";
			fireEvent.change(getByTestId("EntityRegistrationForm__description"), { target: { value: longText } });
		});

		act(() => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should fail validation on website input in first step", async () => {
		const { asFragment, getByTestId } = renderPage();

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());
		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__display-name")).toHaveValue(
				BusinessTransactionsFixture.asset.data.name,
			),
		);

		act(() => {
			fireEvent.change(getByTestId("EntityRegistrationForm__website"), { target: { value: "wrong url" } });
		});

		act(() => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 2nd step", async () => {
		const { asFragment, getByTestId } = renderPage();

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());
		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__display-name")).toHaveValue(
				BusinessTransactionsFixture.asset.data.name,
			),
		);

		act(() => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});

		await waitFor(() => expect(getByTestId("ReviewStep")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 3rd step", async () => {
		const { asFragment, getByTestId } = renderPage();

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());
		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__display-name")).toHaveValue(
				BusinessTransactionsFixture.asset.data.name,
			),
		);

		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});

		expect(getByTestId("AuthenticationStep")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should show loading toast when submitting send transaction", async () => {
		const { asFragment, getByTestId } = renderPage();
		const loadingToastMock = jest.spyOn(toast, "info");

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());
		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__display-name")).toHaveValue(
				BusinessTransactionsFixture.asset.data.name,
			),
		);

		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});

		act(() => {
			fireEvent.change(getByTestId("AuthenticationStep__mnemonic"), { target: { value: "wrong mnemonic" } });
		});

		act(() => {
			fireEvent.click(getByTestId("SendEntityUpdate__send-button"));
		});

		await waitFor(() => expect(loadingToastMock).toHaveBeenCalled());

		expect(getByTestId("AuthenticationStep")).toBeTruthy();

		loadingToastMock.mockRestore();
	});

	it("should show error message when wrong mnemonic is entered", async () => {
		const { asFragment, getByTestId } = renderPage();
		const errorToastMock = jest.spyOn(toast, "error");

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());
		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__display-name")).toHaveValue(
				BusinessTransactionsFixture.asset.data.name,
			),
		);

		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});

		act(() => {
			fireEvent.change(getByTestId("AuthenticationStep__mnemonic"), { target: { value: "wrong mnemonic" } });
		});

		act(() => {
			fireEvent.click(getByTestId("SendEntityUpdate__send-button"));
		});

		await waitFor(() => expect(errorToastMock).toHaveBeenCalled());

		expect(getByTestId("AuthenticationStep")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		errorToastMock.mockRestore();
	});

	it("should require mnemonic field input", async () => {
		const { asFragment, getByTestId } = renderPage();
		const errorToastMock = jest.spyOn(toast, "error");

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());
		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__display-name")).toHaveValue(
				BusinessTransactionsFixture.asset.data.name,
			),
		);

		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});

		act(() => {
			fireEvent.click(getByTestId("SendEntityUpdate__send-button"));
		});

		await waitFor(() => expect(getByTestId("AuthenticationStep__mnemonic")).toHaveAttribute("aria-invalid"));
		expect(getByTestId("AuthenticationStep")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		errorToastMock.mockRestore();
	});

	it("should succesfully submit entity update transaction", async () => {
		const { asFragment, getByTestId } = renderPage();

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());
		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__display-name")).toHaveValue(
				BusinessTransactionsFixture.asset.data.name,
			),
		);

		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});

		act(() => {
			fireEvent.change(getByTestId("AuthenticationStep__mnemonic"), { target: { value: "passphrase" } });
		});

		await waitFor(() => {
			expect(getByTestId("AuthenticationStep__mnemonic")).toHaveValue("passphrase");
		});
		expect(asFragment()).toMatchSnapshot();

		const signMock = jest
			.spyOn(wallet.transaction(), "signEntityUpdate")
			.mockReturnValue(Promise.resolve(EntityUpdateTransactionFixture.data.id));
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockReturnValue(
			Promise.resolve({
				errors: {},
				rejected: [],
				accepted: [EntityUpdateTransactionFixture.data.id],
			}),
		);
		const transactionMock = createTransactionMock(wallet);

		act(() => {
			fireEvent.click(getByTestId("SendEntityUpdate__send-button"));
		});

		await waitFor(() => expect(signMock).toBeCalled());
		await waitFor(() => expect(broadcastMock).toHaveBeenCalled());
		await waitFor(() => expect(transactionMock).toHaveBeenCalled());

		await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());
		await waitFor(() => expect(getByTestId("SentStep__ipfs-data")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();

		signMock.mockRestore();
		broadcastMock.mockRestore();
		transactionMock.mockRestore();
	});

	it("should handle download transaction button click on step 4", async () => {
		const { asFragment, getByTestId } = renderPage();

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());
		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__display-name")).toHaveValue(
				BusinessTransactionsFixture.asset.data.name,
			),
		);

		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});

		act(() => {
			fireEvent.change(getByTestId("AuthenticationStep__mnemonic"), { target: { value: "passphrase" } });
		});

		await waitFor(() => {
			expect(getByTestId("AuthenticationStep__mnemonic")).toHaveValue("passphrase");
		});
		expect(asFragment()).toMatchSnapshot();

		const signMock = jest
			.spyOn(wallet.transaction(), "signEntityUpdate")
			.mockReturnValue(Promise.resolve(EntityUpdateTransactionFixture.data.id));
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockReturnValue(
			/* @ts-ignore */
			Promise.resolve({
				errors: undefined,
				rejected: [],
				accepted: [EntityUpdateTransactionFixture.data.id],
			}),
		);
		const transactionMock = createTransactionMock(wallet);

		act(() => {
			fireEvent.click(getByTestId("SendEntityUpdate__send-button"));
		});

		await waitFor(() => expect(signMock).toBeCalled());
		await waitFor(() => expect(broadcastMock).toHaveBeenCalled());
		await waitFor(() => expect(transactionMock).toHaveBeenCalled());

		await waitFor(() => expect(getByTestId("TransactionSuccessful")).toBeTruthy());
		await waitFor(() => expect(getByTestId("SentStep__ipfs-data")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();

		act(() => {
			fireEvent.click(getByTestId("SendEntityUpdate__download-button"));
		});

		await waitFor(() => expect(defaultFormValues.onDownload).toHaveBeenCalled());

		signMock.mockRestore();
		broadcastMock.mockRestore();
		transactionMock.mockRestore();
	});

	it("should show broadcast error", async () => {
		const { getByTestId } = renderPage();
		const errorToastMock = jest.spyOn(toast, "error");

		await waitFor(() => expect(getByTestId("EntityRegistrationForm")).toBeTruthy());
		await waitFor(() =>
			expect(getByTestId("EntityRegistrationForm__display-name")).toHaveValue(
				BusinessTransactionsFixture.asset.data.name,
			),
		);

		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});

		act(() => {
			fireEvent.change(getByTestId("AuthenticationStep__mnemonic"), { target: { value: "wrong mnemonic" } });
		});

		const signMock = jest
			.spyOn(wallet.transaction(), "signEntityUpdate")
			.mockReturnValue(Promise.resolve(EntityUpdateTransactionFixture.data.id));
		const broadcastMock = jest.spyOn(wallet.transaction(), "broadcast").mockReturnValue(
			Promise.resolve({
				errors: { [EntityUpdateTransactionFixture.data.id]: ["broadcast error"] },
				rejected: [EntityUpdateTransactionFixture.data.id],
				accepted: [],
			}),
		);

		act(() => {
			fireEvent.click(getByTestId("SendEntityUpdate__send-button"));
		});

		await waitFor(() => expect(signMock).toHaveBeenCalled());
		await waitFor(() => expect(broadcastMock).toHaveBeenCalled());
		await waitFor(() => expect(errorToastMock).toHaveBeenCalled());

		signMock.mockRestore();
		broadcastMock.mockRestore();
		errorToastMock.mockRestore();
	});
});
