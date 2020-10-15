import { ReadOnlyWallet } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { render } from "testing-library";
import { data } from "tests/fixtures/coins/ark/devnet/delegates.json";

import { VoteList } from "./VoteList";

let votes: ReadOnlyWallet[];

describe("VoteList", () => {
	beforeAll(() => {
		votes = [0, 1, 2].map(
			(index) =>
				new ReadOnlyWallet({
					address: data[index].address,
					explorerLink: "",
					publicKey: data[index].publicKey,
					username: data[index].username,
					rank: data[index].rank,
				}),
		);
	});

	it("should render", () => {
		const { container, asFragment } = render(<VoteList votes={votes} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with empty list", () => {
		const { container, asFragment } = render(<VoteList votes={[]} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
