import { availableNetworksMock } from "domains/network/data";
import React from "react";
import { act, fireEvent, renderWithRouter } from "testing-library";

import { addressListData, delegateListData } from "../../data";
import { translations } from "../../i18n";
import { Votes } from "./Votes";

const networks = availableNetworksMock;

describe("Votes", () => {
	it("should render", () => {
		const { container, asFragment } = renderWithRouter(
			<Votes networks={networks} addressList={addressListData} delegateList={delegateListData} />,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select a network", () => {
		const { container, asFragment, getByTestId } = renderWithRouter(
			<Votes networks={networks} addressList={addressListData} delegateList={delegateListData} />,
		);
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
		const { asFragment, getByTestId, getAllByTestId } = renderWithRouter(
			<Votes networks={networks} addressList={addressListData} delegateList={delegateListData} />,
		);
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
		const { asFragment, getByTestId, getAllByTestId } = renderWithRouter(
			<Votes networks={networks} addressList={addressListData} delegateList={delegateListData} />,
		);
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
