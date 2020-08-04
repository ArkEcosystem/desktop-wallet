import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { availableNetworksMock } from "domains/network/data";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, renderWithRouter } from "utils/testing-library";

import { addressListData, delegateListData } from "../../data";
import { translations } from "../../i18n";
import { Votes } from "./Votes";

const networks = availableNetworksMock;
let profile: Profile;
let route: string;

const renderPage = () =>
	renderWithRouter(
		<Route path="/profiles/:profileId/votes">
			<Votes networks={networks} addressList={addressListData} delegateList={delegateListData} />
		</Route>,
		{
			routes: [route],
		},
	);

describe("Votes", () => {
	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		route = `/profiles/${profile.id()}/votes`;
	});

	it("should render", () => {
		const { container, asFragment } = renderPage();

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select a network", () => {
		const { container, asFragment, getByTestId } = renderPage();
		const selectAssetInput = getByTestId("SelectNetworkInput__input");

		act(() => {
			fireEvent.change(selectAssetInput, { target: { value: "Bitco" } });
		});

		act(() => {
			fireEvent.keyDown(selectAssetInput, { key: "Enter", code: 13 });
		});

		expect(container).toBeTruthy();
		expect(selectAssetInput).toHaveValue("Bitcoin");
		expect(getByTestId("AddressList")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select address", () => {
		const { asFragment, getByTestId, getAllByTestId } = renderPage();
		const selectAssetInput = getByTestId("SelectNetworkInput__input");

		act(() => {
			fireEvent.change(selectAssetInput, { target: { value: "Bitco" } });
		});

		act(() => {
			fireEvent.keyDown(selectAssetInput, { key: "Enter", code: 13 });
		});

		expect(getByTestId("AddressList")).toBeTruthy();

		const selectAddressButtons = getAllByTestId("AddressListItem__button--select");

		act(() => {
			fireEvent.click(selectAddressButtons[0]);
		});

		expect(getByTestId("DelegateList")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select a delegate", () => {
		const { asFragment, getByTestId, getAllByTestId } = renderPage();
		const selectAssetInput = getByTestId("SelectNetworkInput__input");

		act(() => {
			fireEvent.change(selectAssetInput, { target: { value: "Bitco" } });
		});

		act(() => {
			fireEvent.keyDown(selectAssetInput, { key: "Enter", code: 13 });
		});

		expect(getByTestId("AddressList")).toBeTruthy();

		const selectAddressButtons = getAllByTestId("AddressListItem__button--select");

		act(() => {
			fireEvent.click(selectAddressButtons[0]);
		});

		expect(getByTestId("DelegateList")).toBeTruthy();

		const selectDelegateButtons = getAllByTestId("DelegateListItem__button--toggle");

		fireEvent.click(selectDelegateButtons[0]);
		fireEvent.click(selectDelegateButtons[1]);
		fireEvent.click(selectDelegateButtons[2]);

		expect(getByTestId("DelegateList__footer")).toHaveTextContent(translations.DELEGATE_LIST.SHOW_LIST);
		expect(asFragment()).toMatchSnapshot();
	});
});
