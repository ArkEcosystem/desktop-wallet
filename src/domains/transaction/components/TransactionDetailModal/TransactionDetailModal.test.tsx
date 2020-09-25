import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { Route } from "react-router-dom";
import { TransactionFixture } from "tests/fixtures/transactions";
import { getDefaultProfileId, renderWithRouter, syncDelegates } from "utils/testing-library";

// i18n
import { translations } from "../../i18n";
import { TransactionDetailModal } from "./TransactionDetailModal";

const history = createMemoryHistory();

const fixtureProfileId = getDefaultProfileId();
let dashboardURL: string;

describe("TransactionDetailModal", () => {
	beforeAll(async () => {
		nock.disableNetConnect();
		nock("https://dwallets.ark.io")
			.get("/api/delegates")
			.query({ page: "1" })
			.reply(200, require("tests/fixtures/coins/ark/delegates.json"))
			.persist();

		await syncDelegates();
	});

	beforeEach(() => {
		dashboardURL = `/profiles/${fixtureProfileId}/dashboard`;
		history.push(dashboardURL);
	});

	it("should not render if not open", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<TransactionDetailModal
					isOpen={false}
					transactionItem={{
						...TransactionFixture,
						blockId: () => "as32d1as65d1as3d1as32d1asd51as3d21as3d2as165das",
						type: () => "transfer",
					}}
				/>
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a transfer modal", () => {
		const { asFragment, getByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<TransactionDetailModal
					isOpen={true}
					transactionItem={{
						...TransactionFixture,
						blockId: () => "as32d1as65d1as3d1as32d1asd51as3d21as3d2as165das",
						type: () => "transfer",
					}}
				/>
				,
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_TRANSFER_DETAIL.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a multi signature modal", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<TransactionDetailModal
					isOpen={true}
					transactionItem={{
						...TransactionFixture,
						blockId: () => "as32d1as65d1as3d1as32d1asd51as3d21as3d2as165das",
						type: () => "multiSignature",
					}}
				/>
				,
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_MULTISIGNATURE_DETAIL.STEP_1.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a multi payment modal", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<TransactionDetailModal
					isOpen={true}
					transactionItem={{
						...TransactionFixture,
						blockId: () => "as32d1as65d1as3d1as32d1asd51as3d21as3d2as165das",
						type: () => "multiPayment",
						wallet: () => ({
							alias: () => "Test Wallet",
							currency: () => "ARK",
							exchangeCurrency: () => "BTC",
						}),
					}}
				/>
				,
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_TRANSFER_DETAIL.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a ipfs modal", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<TransactionDetailModal
					isOpen={true}
					transactionItem={{
						...TransactionFixture,
						data: {
							asset: { ipfs: "as32d1as65d1as3d1as32d1asd51as3d21as3d2as165das" },
							blockId: "as32d1as65d1as3d1as32d1asd51as3d21as3d2as165das",
						},
						type: () => "ipfs",
					}}
				/>
				,
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_IPFS_DETAIL.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a vote modal", () => {
		const { asFragment, getByTestId, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<TransactionDetailModal
					isOpen={true}
					transactionItem={{
						...TransactionFixture,
						blockId: () => "as32d1as65d1as3d1as32d1asd51as3d21as3d2as165das",
						type: () => "vote",
					}}
				/>
				,
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_VOTE_DETAIL.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a unvote modal", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<TransactionDetailModal
					isOpen={true}
					transactionItem={{
						...TransactionFixture,
						blockId: () => "as32d1as65d1as3d1as32d1asd51as3d21as3d2as165das",
						type: () => "unvote",
					}}
				/>
				,
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_VOTE_DETAIL.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a delegate registration modal", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<TransactionDetailModal
					isOpen={true}
					transactionItem={{
						...TransactionFixture,
						blockId: () => "as32d1as65d1as3d1as32d1asd51as3d21as3d2as165das",
						username: () => "ARK Wallet",
						type: () => "delegateRegistration",
					}}
				/>
				,
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_DELEGATE_REGISTRATION_DETAIL.TITLE);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render as null if unknow type", () => {
		// disable console to throw to avoid break the CI (this is added because we don't have error boundaries)
		jest.spyOn(console, "error").mockImplementation();

		expect(() =>
			renderWithRouter(
				<Route path="/profiles/:profileId/dashboard">
					<TransactionDetailModal
						isOpen={true}
						transactionItem={{
							...TransactionFixture,
							blockId: () => "as32d1as65d1as3d1as32d1asd51as3d21as3d2as165das",
							type: () => "unknown",
						}}
					/>
					,
				</Route>,
				{
					routes: [dashboardURL],
					history,
				},
			),
		).toThrow();
	});
});
