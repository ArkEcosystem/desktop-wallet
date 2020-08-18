import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
// i18n
import { TransactionFixture } from "tests/fixtures/transactions";
import { env, getDefaultProfileId, renderWithRouter } from "utils/testing-library";

import { translations } from "../../i18n";
import { TransferDetail } from "./TransferDetail";

const history = createMemoryHistory();
let emptyProfile: Profile;

const fixtureProfileId = getDefaultProfileId();
let dashboardURL: string;

beforeEach(() => {
	emptyProfile = env.profiles().findById("cba050f1-880f-45f0-9af9-cfe48f406052");
	dashboardURL = `/profiles/${fixtureProfileId}/dashboard`;
	history.push(dashboardURL);
});

describe("TransferDetail", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<TransferDetail
					isOpen={false}
					onClose={() => console.log("onClose")}
					transaction={{ ...TransactionFixture, data: { blockId: "adsad12312xsd1w312e1s13203e12" } }}
				/>
				,
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<TransferDetail
					isOpen={true}
					onClose={() => console.log("onClose")}
					transaction={{ ...TransactionFixture, data: { blockId: "adsad12312xsd1w312e1s13203e12" } }}
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

	it("should render as confirmed", () => {
		const { asFragment, getByText, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<TransferDetail
					isOpen={true}
					onClose={() => console.log("onClose")}
					transaction={{
						...TransactionFixture,
						confirmations: () => BigNumber.make(52),
						data: { blockId: "adsad12312xsd1w312e1s13203e12" },
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
		expect(getByText("Well Confirmed")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render as not is sent", () => {
		const { asFragment, getByText, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<TransferDetail
					isOpen={true}
					onClose={() => console.log("onClose")}
					transaction={{
						...TransactionFixture,
						isSent: () => false,
						data: { blockId: "adsad12312xsd1w312e1s13203e12" },
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

	it("should render with wallet alias", () => {
		const { asFragment, getByText, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<TransferDetail
					isOpen={true}
					onClose={() => console.log("onClose")}
					transaction={{
						...TransactionFixture,
						isSent: () => false,
						recipient: () => "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
						data: { blockId: "adsad12312xsd1w312e1s13203e12" },
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
});
