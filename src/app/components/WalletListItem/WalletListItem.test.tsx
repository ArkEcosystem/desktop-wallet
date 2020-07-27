import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment, Wallet, WalletFlag } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";
import React from "react";
import { act } from "react-dom/test-utils";
import { fireEvent, render } from "testing-library";
import fixtureData from "tests/fixtures/env/storage-mainnet.json";
import { mockArkHttp, StubStorage } from "tests/mocks";

import { WalletListItem } from "./WalletListItem";

let wallet: Wallet;

beforeAll(() => {
	mockArkHttp();
});

describe("WalletListItem", () => {
	beforeEach(async () => {
		const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
		await env.bootFromObject(fixtureData);

		const profile = env.profiles().all()[0];
		wallet = profile.wallets().values()[0];
		wallet.data().set(WalletFlag.Starred, true);
		wallet.data().set(WalletFlag.Ledger, true);
	});

	it("should render", () => {
		const { container } = render(
			<table>
				<tbody>
					<WalletListItem wallet={wallet} />
				</tbody>
			</table>,
		);
		expect(container).toMatchSnapshot();
	});

	it("should render a button if variant is 'singleAction'", () => {
		const actions = [{ label: "Option 1", value: "1" }];

		const { container, getByTestId } = render(
			<table>
				<tbody>
					<WalletListItem wallet={wallet} actions={actions} variant="singleAction" />
				</tbody>
			</table>,
		);

		expect(() => getByTestId("dropdown__toggle")).toThrow(/Unable to find an element by/);
		expect(getByTestId("button")).toHaveTextContent(actions[0].label);
		expect(container).toMatchSnapshot();
	});

	it("should trigger onAction callback if provided", () => {
		const fn = jest.fn();
		const options = [
			{ label: "Option 1", value: "1" },
			{ label: "Option 2", value: "2" },
		];

		const { getByTestId, container } = render(
			<table>
				<tbody>
					<WalletListItem wallet={wallet} actions={options} onAction={fn} />
				</tbody>
			</table>,
		);
		const toggle = getByTestId("dropdown__toggle");
		act(() => {
			fireEvent.click(toggle);
		});

		expect(getByTestId("dropdown__content")).toBeTruthy();

		const firstOption = getByTestId("dropdown__option--0");
		expect(firstOption).toBeTruthy();

		act(() => {
			fireEvent.click(firstOption);
		});

		expect(container.querySelectorAll("ul").length).toEqual(0);
		expect(fn).toHaveBeenCalled();
	});

	it("should ignore onAction callback if not provided", () => {
		const options = [
			{ label: "Option 1", value: "1" },
			{ label: "Option 2", value: "2" },
		];

		const { getByTestId, container } = render(
			<table>
				<tbody>
					<WalletListItem wallet={wallet} actions={options} />
				</tbody>
			</table>,
		);
		const toggle = getByTestId("dropdown__toggle");
		act(() => {
			fireEvent.click(toggle);
		});

		expect(getByTestId("dropdown__content")).toBeTruthy();

		const firstOption = getByTestId("dropdown__option--0");
		expect(firstOption).toBeTruthy();

		act(() => {
			fireEvent.click(firstOption);
		});

		expect(container.querySelectorAll("ul").length).toEqual(0);
	});
});
