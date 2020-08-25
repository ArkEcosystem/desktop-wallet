import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import nock from "nock";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, waitFor, within } from "testing-library";

import { DelegateTable } from "./DelegateTable";

let profile: Profile;
let delegates: ReadWriteWallet[];

describe("Welcome", () => {
	beforeAll(() => {
		nock("https://dwallets.ark.io")
			.get("/delegates/D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb")
			.reply(200, require("tests/fixtures/delegates/D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb.json"));

		profile = env.profiles().findById(getDefaultProfileId());

		const wallets = profile.wallets().values();
		delegates = wallets.filter((wallet: ReadWriteWallet) => wallet.isDelegate());
	});

	it("should render empty state", () => {
		const { asFragment } = render(<DelegateTable wallets={[]} />);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render delegates", async () => {
		const { asFragment, getAllByTestId } = render(<DelegateTable wallets={delegates} />);

		await waitFor(() => expect(getAllByTestId("DelegateRowItem").length).toEqual(1));
		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle resign delegate dropdown action", async () => {
		const onAction = jest.fn();
		const { asFragment, getAllByTestId } = render(<DelegateTable wallets={delegates} onAction={onAction} />);
		expect(asFragment()).toMatchSnapshot();

		await waitFor(() => expect(getAllByTestId("DelegateRowItem").length).toEqual(1));

		const dropdownToggle = within(getAllByTestId("DelegateRowItem")[0]).getByTestId("dropdown__toggle");
		act(() => {
			fireEvent.click(dropdownToggle);
		});

		const resignOption = within(getAllByTestId("DelegateRowItem")[0]).getByTestId("dropdown__option--1");
		act(() => {
			fireEvent.click(resignOption);
		});

		expect(onAction).toBeCalledWith({ walletId: delegates[0].id(), action: "resign" });
	});

	it("should handle update delegate dropdown action", async () => {
		const onAction = jest.fn();
		const { asFragment, getAllByTestId } = render(<DelegateTable wallets={delegates} onAction={onAction} />);
		expect(asFragment()).toMatchSnapshot();

		await waitFor(() => expect(getAllByTestId("DelegateRowItem").length).toEqual(1));

		const dropdownToggle = within(getAllByTestId("DelegateRowItem")[0]).getByTestId("dropdown__toggle");
		act(() => {
			fireEvent.click(dropdownToggle);
		});

		const resignOption = within(getAllByTestId("DelegateRowItem")[0]).getByTestId("dropdown__option--0");
		act(() => {
			fireEvent.click(resignOption);
		});

		expect(onAction).toBeCalledWith({ walletId: delegates[0].id(), action: "update" });
	});
});
