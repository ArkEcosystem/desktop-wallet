import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import nock from "nock";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, syncDelegates, waitFor } from "testing-library";

import { DelegateRowItem } from "./DelegateRowItem";

let profile: Profile;
let delegates: ReadWriteWallet[];

describe("DelegateRowItem", () => {
	beforeAll(async () => {
		nock("https://dwallets.ark.io")
			.get("/api/delegates")
			.query({ page: "1" })
			.reply(200, require("tests/fixtures/coins/ark/delegates-devnet.json"))
			.get("/delegates/D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb")
			.reply(200, require("tests/fixtures/delegates/D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb.json"));

		profile = env.profiles().findById(getDefaultProfileId());

		const wallets = profile.wallets().values();
		delegates = wallets.filter((wallet: ReadWriteWallet) => wallet.isDelegate());

		await syncDelegates();
	});

	it("should render", async () => {
		const { asFragment, queryAllByTestId } = render(
			<table>
				<tbody>
					<DelegateRowItem wallet={delegates[0]} />
				</tbody>
			</table>,
		);

		await waitFor(() => expect(queryAllByTestId("TableRow")).toHaveLength(1));
		expect(asFragment()).toMatchSnapshot();
	});

	// TODO: this loads instantly because all data is retrieved memory. Alter test or remove loading state altogether.
	it.skip("should render loading state", async () => {
		const { asFragment, queryAllByTestId } = render(
			<table>
				<tbody>
					<DelegateRowItem wallet={delegates[0]} />
				</tbody>
			</table>,
		);

		expect(queryAllByTestId("DelegateRowItemSkeleton")).not.toHaveLength(0);
		expect(asFragment()).toMatchSnapshot();

		await waitFor(() => expect(queryAllByTestId("DelegateRowItemSkeleton")).toHaveLength(0));
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render all columns", async () => {
		const { asFragment, getByTestId, queryAllByTestId } = render(
			<table>
				<tbody>
					<DelegateRowItem wallet={delegates[0]} />
				</tbody>
			</table>,
		);

		await waitFor(() => expect(queryAllByTestId("TableRow")).toHaveLength(1));

		expect(getByTestId("DelegateRowItem__address")).toBeTruthy();
		expect(getByTestId("DelegateRowItem__username")).toBeTruthy();
		expect(getByTestId("DelegateRowItem__msq")).toBeTruthy();
		expect(getByTestId("DelegateRowItem__rank")).toBeTruthy();
		expect(getByTestId("DelegateRowItem__status")).toBeTruthy();
		expect(getByTestId("DelegateRowItem__forged")).toBeTruthy();
		expect(getByTestId("DelegateRowItem__votes")).toBeTruthy();
		expect(getByTestId("DelegateRowItem__actions")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render confirmed status", async () => {
		const { asFragment, queryAllByTestId } = render(
			<table>
				<tbody>
					<DelegateRowItem wallet={delegates[0]} isConfirmed />
				</tbody>
			</table>,
		);

		await waitFor(() => expect(queryAllByTestId("TableRow")).toHaveLength(1));
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render uncofirmed status", async () => {
		const { asFragment, queryAllByTestId } = render(
			<table>
				<tbody>
					<DelegateRowItem wallet={delegates[0]} isConfirmed={false} />
				</tbody>
			</table>,
		);

		await waitFor(() => expect(queryAllByTestId("TableRow")).toHaveLength(1));
		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle delegate resign action", async () => {
		const onAction = jest.fn();
		const { getByTestId, queryAllByTestId } = render(
			<table>
				<tbody>
					<DelegateRowItem wallet={delegates[0]} onAction={onAction} />
				</tbody>
			</table>,
		);

		await waitFor(() => expect(queryAllByTestId("TableRow")).toHaveLength(1));
		expect(getByTestId("DelegateRowItem__actions")).toBeTruthy();

		const dropdownToggle = getByTestId("dropdown__toggle");
		act(() => {
			fireEvent.click(dropdownToggle);
		});

		const resignOption = getByTestId("dropdown__option--1");
		act(() => {
			fireEvent.click(resignOption);
		});

		expect(onAction).toBeCalledWith({ walletId: delegates[0].id(), action: "resign" });
	});

	it("should handle delegate update action", async () => {
		const onAction = jest.fn();
		const { getByTestId, queryAllByTestId } = render(
			<table>
				<tbody>
					<DelegateRowItem wallet={delegates[0]} onAction={onAction} />
				</tbody>
			</table>,
		);

		await waitFor(() => expect(queryAllByTestId("TableRow")).toHaveLength(1));
		expect(getByTestId("DelegateRowItem__actions")).toBeTruthy();

		const dropdownToggle = getByTestId("dropdown__toggle");
		act(() => {
			fireEvent.click(dropdownToggle);
		});

		const resignOption = getByTestId("dropdown__option--0");
		act(() => {
			fireEvent.click(resignOption);
		});

		expect(onAction).toBeCalledWith({ walletId: delegates[0].id(), action: "updateDelegate" });
	});

	it("should set shadow color on mouse events", () => {
		const setState = jest.fn();
		const useStateSpy = jest.spyOn(React, "useState");

		useStateSpy.mockImplementation((state) => [state, setState]);

		const { getByTestId } = render(
			<table>
				<tbody>
					<DelegateRowItem wallet={delegates[0]} />
				</tbody>
			</table>,
		);

		fireEvent.mouseEnter(getByTestId("TableRow"));
		fireEvent.mouseLeave(getByTestId("TableRow"));

		expect(setState).toHaveBeenCalledWith("--theme-color-neutral-100");
		expect(setState).toHaveBeenCalledWith("");
	});
});
