import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import nock from "nock";
import React from "react";
import { env, getDefaultProfileId, render } from "testing-library";

import { DelegateTable } from "./DelegateTable";

let profile: Profile;
let delegates: ReadWriteWallet[];

describe("Welcome", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());

		const wallets = profile.wallets().values();

		await env.persist();
		nock.enableNetConnect();

		delegates = wallets.filter((wallet: ReadWriteWallet) => wallet.isDelegate());
	});

	it("should render empty state", () => {
		const { asFragment } = render(<DelegateTable wallets={[]} />);
		expect(asFragment()).toMatchSnapshot();
	});

	// it("should have a functional toggle", () => {
	// 	const onAction = jest.fn();
	// 	const { getAllByTestId, getByTestId } = render(<DelegateTable data={registrations} onAction={onAction} />);
	//
	// 	const toggle = getAllByTestId("dropdown__toggle");
	//
	// 	act(() => {
	// 		fireEvent.click(toggle[0]);
	// 	});
	//
	// 	const secondOption = getByTestId("dropdown__option--1");
	// 	expect(secondOption).toBeTruthy();
	//
	// 	act(() => {
	// 		fireEvent.click(secondOption);
	// 	});
	//
	// 	expect(onAction).toHaveBeenCalled();
	// });
});
