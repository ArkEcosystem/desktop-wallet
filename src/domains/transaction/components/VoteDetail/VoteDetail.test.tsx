import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { TransactionFixture } from "tests/fixtures/transactions";
import { env, getDefaultProfileId, renderWithRouter, waitFor } from "utils/testing-library";

// i18n
import { translations } from "../../i18n";
import { VoteDetail } from "./VoteDetail";

const history = createMemoryHistory();
let emptyProfile: Profile;

const fixtureProfileId = getDefaultProfileId();
let dashboardURL: string;

beforeEach(() => {
	emptyProfile = env.profiles().findById("cba050f1-880f-45f0-9af9-cfe48f406052");
	dashboardURL = `/profiles/${fixtureProfileId}/dashboard`;
	history.push(dashboardURL);
});

describe("VoteDetail", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<VoteDetail isOpen={false} transaction={TransactionFixture} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		waitFor(() => expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/));
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<VoteDetail isOpen={true} transaction={TransactionFixture} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		waitFor(() => expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_VOTE_DETAIL.TITLE));
		expect(asFragment()).toMatchSnapshot();
	});
});
