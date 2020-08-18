import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { TransactionFixture } from "tests/fixtures/transactions";
import { env, getDefaultProfileId, renderWithRouter } from "utils/testing-library";

// i18n
import { translations } from "../../i18n";
import { TransactionDetailModal } from "./TransactionDetailModal";

const history = createMemoryHistory();
let emptyProfile: Profile;

const fixtureProfileId = getDefaultProfileId();
let dashboardURL: string;

beforeEach(() => {
	emptyProfile = env.profiles().findById("cba050f1-880f-45f0-9af9-cfe48f406052");
	dashboardURL = `/profiles/${fixtureProfileId}/dashboard`;
	history.push(dashboardURL);
});

describe("TransactionDetailModal", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<TransactionDetailModal
					isOpen={false}
					transactionItem={{
						...TransactionFixture,
						data: { blockId: "as32d1as65d1as3d1as32d1asd51as3d21as3d2as165das" },
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
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<TransactionDetailModal
					isOpen={true}
					transactionItem={{
						...TransactionFixture,
						data: { blockId: "as32d1as65d1as3d1as32d1asd51as3d21as3d2as165das" },
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

	it("should render a multiSignature modal", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<TransactionDetailModal
					isOpen={true}
					transactionItem={{
						...TransactionFixture,
						data: { blockId: "as32d1as65d1as3d1as32d1asd51as3d21as3d2as165das" },
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

	it("should render a multiPayment modal", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<TransactionDetailModal
					isOpen={true}
					transactionItem={{
						...TransactionFixture,
						data: { blockId: "as32d1as65d1as3d1as32d1asd51as3d21as3d2as165das" },
						type: () => "multiPayment",
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
						data: { blockId: "as32d1as65d1as3d1as32d1asd51as3d21as3d2as165das" },
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
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<TransactionDetailModal
					isOpen={true}
					transactionItem={{
						...TransactionFixture,
						data: { blockId: "as32d1as65d1as3d1as32d1asd51as3d21as3d2as165das" },
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
						data: { blockId: "as32d1as65d1as3d1as32d1asd51as3d21as3d2as165das" },
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
							data: { blockId: "as32d1as65d1as3d1as32d1asd51as3d21as3d2as165das" },
							type: () => "unknow",
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
