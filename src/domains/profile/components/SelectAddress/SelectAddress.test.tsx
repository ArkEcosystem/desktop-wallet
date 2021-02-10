import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, waitFor } from "testing-library";

import { SelectAddress } from "./SelectAddress";

let wallets: ReadWriteWallet[];

beforeAll(async () => {
	const profile = env.profiles().findById(getDefaultProfileId());
	await profile.wallets().importByMnemonic("additional wallet", "ARK", "ark.devnet");

	wallets = profile.wallets().values();
});

describe("SelectAddress", () => {
	it("should render empty", () => {
		const { container } = render(<SelectAddress wallets={wallets} />);
		expect(container).toMatchSnapshot();
	});

	it("should render disabled", () => {
		const { container } = render(<SelectAddress disabled wallets={wallets} />);
		expect(container).toMatchSnapshot();
	});

	it("should render invalid", () => {
		const { container, getByTestId } = render(<SelectAddress isInvalid wallets={wallets} />);
		expect(getByTestId("Input-error")).toBeVisible();
		expect(container).toMatchSnapshot();
	});

	it("should render with preselected address", () => {
		const { container } = render(
			<SelectAddress wallets={wallets} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" />,
		);
		expect(container).toMatchSnapshot();
	});

	it("should render with preselected verified address", () => {
		const { container } = render(<SelectAddress isVerified wallets={wallets} />);
		expect(container).toMatchSnapshot();
	});

	it("should open and close wallets modal", async () => {
		const { getByTestId } = render(
			<SelectAddress wallets={wallets} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		act(() => {
			fireEvent.click(getByTestId("SelectAddress__wrapper"));
		});

		expect(getByTestId("modal__inner")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});

		await waitFor(() => {
			expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		});
	});

	it("should not open if disabled", () => {
		const { getByTestId } = render(
			<SelectAddress wallets={wallets} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" disabled={true} />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		act(() => {
			fireEvent.click(getByTestId("SelectAddress__wrapper"));
		});

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
	});

	it("should select address from wallets modal", async () => {
		const { getByTestId } = render(
			<SelectAddress wallets={wallets} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		act(() => {
			fireEvent.click(getByTestId("SelectAddress__wrapper"));
		});

		await waitFor(() => {
			expect(getByTestId("modal__inner")).toBeTruthy();
		});

		const firstAddress = getByTestId("SearchWalletListItem__select-0");

		act(() => {
			fireEvent.click(firstAddress);
		});

		await waitFor(() => {
			expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

			const selectedAddressValue = wallets[0].address();
			expect(getByTestId("SelectAddress__input")).toHaveValue(selectedAddressValue);
		});
	});

	it("should not open wallets modal if disabled", async () => {
		const { getByTestId } = render(
			<SelectAddress wallets={wallets} disabled address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		act(() => {
			fireEvent.click(getByTestId("SelectAddress__wrapper"));
		});

		await waitFor(() => {
			expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		});
	});

	it("should call onChange prop if provided", async () => {
		const onChange = jest.fn();

		const { getByTestId, getAllByTestId } = render(
			<SelectAddress wallets={wallets} onChange={onChange} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" />,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		act(() => {
			fireEvent.click(getByTestId("SelectAddress__wrapper"));
		});

		await waitFor(() => {
			expect(getByTestId("modal__inner")).toBeTruthy();
		});

		const firstAddress = getByTestId("SearchWalletListItem__select-0");

		act(() => {
			fireEvent.click(firstAddress);
		});

		await waitFor(() => {
			expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
			expect(onChange).toBeCalled();
		});
	});
});
