/* eslint-disable @typescript-eslint/require-await */
import { httpClient } from "app/services";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { Route } from "react-router-dom";
import { toast } from "react-toastify";
import IpfsFixture from "tests/fixtures/ipfs/QmRwgWaaEyYgGqp55196TsFDQLW4NZkyTnPwiSVhJ7NPRV.json";
import BusinessTransactionsFixture from "tests/fixtures/registrations/businesses.json";
import {
	act,
	defaultNetMocks,
	fireEvent,
	getDefaultProfileId,
	getDefaultWalletId,
	renderWithRouter,
	syncDelegates,
	syncFees,
	waitFor,
} from "utils/testing-library";

import { SendEntityUpdate } from "../SendEntityUpdate";

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

describe("SendEntityUpdate", () => {
	beforeAll(async () => {
		await syncDelegates();
		await syncFees();
	});

	beforeEach(() => {
		defaultNetMocks();

		nock("https://dwallets.ark.io")
			.get("/api/transactions/df520b0a278314e998dc93be1e20c72b8313950c19da23967a9db60eb4e990da")
			.query(true)
			.reply(200, () => ({ data: BusinessTransactionsFixture.data[0] }))
			.persist();

		nock("https://platform.ark.io/api")
			.get("/ipfs/QmRwgWaaEyYgGqp55196TsFDQLW4NZkyTnPwiSVhJ7NPRV")
			.reply(200, IpfsFixture)
			.persist();
	});

	it("should fetch and fill entity name input from ipfs", async () => {
		const { getByTestId } = renderPage();

		expect(getByTestId("SendEntityUpdate__first-step")).toBeTruthy();

		await waitFor(() =>
			expect(getByTestId("SendEntityUpdate__name")).toHaveValue(IpfsFixture.data.meta.displayName),
		);
	});

	it("should fetch and fill entity description input from ipfs", async () => {
		const { getByTestId } = renderPage();

		expect(getByTestId("SendEntityUpdate__first-step")).toBeTruthy();

		await waitFor(() =>
			expect(getByTestId("SendEntityUpdate__description")).toHaveValue(IpfsFixture.data.meta.description),
		);
	});

	it("should fetch and fill entity website input from ipfs", async () => {
		const { getByTestId } = renderPage();

		expect(getByTestId("SendEntityUpdate__first-step")).toBeTruthy();

		await waitFor(() =>
			expect(getByTestId("SendEntityUpdate__website")).toHaveValue(IpfsFixture.data.meta.website),
		);
	});

	it("should fetch and render sourceControl links collection from ipfs", async () => {
		const { getByTestId, getAllByTestId } = renderPage();

		expect(getByTestId("SendEntityUpdate__first-step")).toBeTruthy();
		expect(getByTestId("SendEntityUpdate__name")).toBeTruthy();

		const sourcesLinkCollection = getAllByTestId("LinkCollection__header")[0];
		expect(sourcesLinkCollection).toBeTruthy();
		act(() => {
			fireEvent.click(sourcesLinkCollection);
		});

		await waitFor(() => expect(getAllByTestId("LinkCollection__remove-link")).toHaveLength(4));
	});

	it("should fetch and render socialMedia links collection from ipfs", async () => {
		const { getByTestId, getAllByTestId } = renderPage();

		expect(getByTestId("SendEntityUpdate__first-step")).toBeTruthy();
		expect(getByTestId("SendEntityUpdate__name")).toBeTruthy();

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
			.reply(200, () => ({ data: BusinessTransactionsFixture.data[0] }));

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

		await waitFor(() =>
			expect(getByTestId("SendEntityUpdate__name")).toHaveValue(ipfsFixtureEmptyResources.data.meta.displayName),
		);
	});

	it("should fetch and render fees for entity update", async () => {
		const { getByTestId } = renderPage();

		expect(getByTestId("SendEntityUpdate__first-step")).toBeTruthy();
		expect(getByTestId("SendEntityUpdate__name")).toBeTruthy();
		const feeInput = getByTestId("InputCurrency");

		await waitFor(() => expect(feeInput).toHaveValue("50"));
	});

	it("should update fee", async () => {
		const { getByTestId, getAllByTestId } = renderPage();

		expect(getByTestId("SendEntityUpdate__first-step")).toBeTruthy();
		expect(getByTestId("SendEntityUpdate__name")).toBeTruthy();
		const feeInput = getByTestId("InputCurrency");

		await waitFor(() => expect(feeInput).toHaveValue("50"));

		act(() => {
			fireEvent.click(getAllByTestId("SelectionBarOption")[0]);
		});

		await waitFor(() => expect(feeInput).toHaveValue("50"));
	});

	it("should fetch and render fees for entity update", async () => {
		const { getByTestId } = renderPage();

		expect(getByTestId("SendEntityUpdate__first-step")).toBeTruthy();
		expect(getByTestId("SendEntityUpdate__name")).toBeTruthy();
		const feeInput = getByTestId("InputCurrency");

		await waitFor(() => expect(feeInput).toHaveValue("50"));
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
			.reply(200, () => ({ data: BusinessTransactionsFixture.data[0] }))
			.persist();

		nock("https://platform.ark.io/api").get("/ipfs/QmRwgWaaEyYgGqp55196TsFDQLW4NZkyTnPwiSVhJ7NPRV").reply(404, {});

		const toastMock = jest.spyOn(toast, "error");
		renderPage();
		await waitFor(() => expect(toastMock).toBeCalled());

		toastMock.mockRestore();
	});

	it("should render 1st step", async () => {
		const { asFragment, getByTestId } = renderPage();

		expect(getByTestId("SendEntityUpdate__first-step")).toBeTruthy();

		await waitFor(() =>
			expect(getByTestId("SendEntityUpdate__name")).toHaveValue(IpfsFixture.data.meta.displayName),
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should should go back", async () => {
		const { asFragment, getByTestId } = renderPage();

		await waitFor(() =>
			expect(getByTestId("SendEntityUpdate__name")).toHaveValue(IpfsFixture.data.meta.displayName),
		);

		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__back-button"));
		});

		expect(getByTestId("SendEntityUpdate__first-step")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should fail validation on name input in first step", async () => {
		const { asFragment, getByTestId } = renderPage();

		await waitFor(() =>
			expect(getByTestId("SendEntityUpdate__name")).toHaveValue(IpfsFixture.data.meta.displayName),
		);

		// Required
		act(() => {
			fireEvent.change(getByTestId("SendEntityUpdate__name"), { target: { value: "" } });
		});

		act(() => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});

		await waitFor(() => expect(getByTestId("SendEntityUpdate__first-step")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();

		// Min length
		act(() => {
			fireEvent.change(getByTestId("SendEntityUpdate__name"), { target: { value: "ab" } });
		});

		act(() => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});

		await waitFor(() => expect(getByTestId("SendEntityUpdate__first-step")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();

		// Max length
		act(() => {
			const longText =
				"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";
			fireEvent.change(getByTestId("SendEntityUpdate__name"), { target: { value: longText } });
		});

		act(() => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});
		await waitFor(() => expect(getByTestId("SendEntityUpdate__first-step")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should fail validation on description textarea in first step", async () => {
		const { asFragment, getByTestId } = renderPage();

		await waitFor(() =>
			expect(getByTestId("SendEntityUpdate__name")).toHaveValue(IpfsFixture.data.meta.displayName),
		);

		// Required
		act(() => {
			fireEvent.change(getByTestId("SendEntityUpdate__description"), { target: { value: "" } });
		});

		act(() => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});

		await waitFor(() => expect(getByTestId("SendEntityUpdate__first-step")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();

		// Min length
		act(() => {
			fireEvent.change(getByTestId("SendEntityUpdate__description"), { target: { value: "ab" } });
		});

		act(() => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});

		await waitFor(() => expect(getByTestId("SendEntityUpdate__first-step")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();

		// Max length
		act(() => {
			const longText =
				"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";
			fireEvent.change(getByTestId("SendEntityUpdate__description"), { target: { value: longText } });
		});

		act(() => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});

		await waitFor(() => expect(getByTestId("SendEntityUpdate__first-step")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should fail validation on website input in first step", async () => {
		const { asFragment, getByTestId } = renderPage();

		await waitFor(() =>
			expect(getByTestId("SendEntityUpdate__name")).toHaveValue(IpfsFixture.data.meta.displayName),
		);

		act(() => {
			fireEvent.change(getByTestId("SendEntityUpdate__website"), { target: { value: "" } });
		});

		act(() => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});

		await waitFor(() => expect(getByTestId("SendEntityUpdate__first-step")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();

		// Wrong url
		act(() => {
			fireEvent.change(getByTestId("SendEntityUpdate__website"), { target: { value: "http://abc" } });
		});

		act(() => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});

		await waitFor(() => expect(getByTestId("SendEntityUpdate__first-step")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 2nd step", async () => {
		const { asFragment, getByTestId } = renderPage();

		await waitFor(() =>
			expect(getByTestId("SendEntityUpdate__name")).toHaveValue(IpfsFixture.data.meta.displayName),
		);

		act(() => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});

		await waitFor(() => expect(getByTestId("SendEntityUpdate__second-step")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 3rd step", async () => {
		const { asFragment, getByTestId } = renderPage();

		await waitFor(() =>
			expect(getByTestId("SendEntityUpdate__name")).toHaveValue(IpfsFixture.data.meta.displayName),
		);

		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});

		expect(getByTestId("SendEntityUpdate__third-step")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 4th step", async () => {
		const { asFragment, getByTestId } = renderPage();

		await waitFor(() =>
			expect(getByTestId("SendEntityUpdate__name")).toHaveValue(IpfsFixture.data.meta.displayName),
		);

		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__send-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__send-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__send-button"));
		});

		expect(getByTestId("TransactionSuccessful")).toBeTruthy();
		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(0);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should submit", async () => {
		const { asFragment, getByTestId } = renderPage();

		await waitFor(() =>
			expect(getByTestId("SendEntityUpdate__name")).toHaveValue(IpfsFixture.data.meta.displayName),
		);

		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__continue-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__send-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__send-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__send-button"));
		});
		await act(async () => {
			fireEvent.click(getByTestId("SendEntityUpdate__download-button"));
		});

		expect(defaultFormValues.onDownload).toHaveBeenCalledTimes(1);
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});
});
