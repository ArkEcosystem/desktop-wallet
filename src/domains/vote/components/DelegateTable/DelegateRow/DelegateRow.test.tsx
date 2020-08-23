import { Coins } from "@arkecosystem/platform-sdk";
import { translations } from "app/i18n/common/i18n";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render } from "testing-library";

import { DelegateRow } from "./DelegateRow";

let delegates: Coins.WalletDataCollection;

describe("DelegateRow", () => {
	beforeAll(async () => {
		const profile = env.profiles().findById(getDefaultProfileId());
		const wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");

		delegates = await wallet.delegates();
	});

	it("should render", () => {
		const { container, asFragment } = render(
			<table>
				<tbody>
					<DelegateRow index={1} delegate={delegates.items()[0]} />
				</tbody>
			</table>,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should emit action on select button", () => {
		const onSelect = jest.fn();
		const { container, asFragment, getByTestId } = render(
			<table>
				<tbody>
					<DelegateRow index={1} delegate={delegates.items()[0]} onSelect={onSelect} />
				</tbody>
			</table>,
		);
		const selectButton = getByTestId("DelegateRow__toggle-1");

		act(() => {
			fireEvent.click(selectButton);
		});

		expect(container).toBeTruthy();
		expect(onSelect).toHaveBeenCalledWith({
			address: delegates.items()[0].address(),
			username: delegates.items()[0].username(),
			rank: delegates.items()[0].rank(),
		});
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render the selected delegate", () => {
		const selected = [
			{
				address: delegates.items()[0].address(),
				username: delegates.items()[0].username()!,
				rank: delegates.items()[0].rank()!,
			},
		];
		const { container, asFragment, getByTestId } = render(
			<table>
				<tbody>
					<DelegateRow index={1} delegate={delegates.items()[0]} selected={selected} />
				</tbody>
			</table>,
		);

		expect(container).toBeTruthy();
		expect(getByTestId("DelegateRow__toggle-1")).toHaveTextContent(translations.UNSELECT);
		expect(asFragment()).toMatchSnapshot();
	});
});
