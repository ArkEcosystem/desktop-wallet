import { act, fireEvent, render } from "@testing-library/react";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

import { addressListData, assets, delegateListData } from "../../data";
import { Votes } from "./Votes";

describe("Votes", () => {
	it("should render", () => {
		const { container, asFragment } = render(
			<I18nextProvider i18n={i18n}>
				<Votes assets={assets} addressList={addressListData} delegateList={delegateListData} />
			</I18nextProvider>,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select a cryptoasset", () => {
		const { container, asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<Votes assets={assets} addressList={addressListData} delegateList={delegateListData} />
			</I18nextProvider>,
		);
		const selectAssetInput = getByTestId("select-asset__input");

		act(() => {
			fireEvent.change(selectAssetInput, { target: { value: "Bitco" } });
		});

		act(() => {
			fireEvent.keyDown(selectAssetInput, { key: "Enter", code: 13 });
		});

		expect(container).toBeTruthy();
		expect(getByTestId("select-asset__selected-Bitcoin")).toBeTruthy();
		expect(getByTestId("AddressList")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select address", () => {
		const { asFragment, getByTestId, getAllByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<Votes assets={assets} addressList={addressListData} delegateList={delegateListData} />
			</I18nextProvider>,
		);
		const selectAssetInput = getByTestId("select-asset__input");

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
		const { asFragment, getByTestId, getAllByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<Votes assets={assets} addressList={addressListData} delegateList={delegateListData} />
			</I18nextProvider>,
		);
		const selectAssetInput = getByTestId("select-asset__input");

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

		expect(getByTestId("DelegateList__footer")).toHaveTextContent("Show List");
		expect(asFragment()).toMatchSnapshot();
	});
});
