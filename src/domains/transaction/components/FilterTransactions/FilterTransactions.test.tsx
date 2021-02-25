import { Profile } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, waitFor } from "utils/testing-library";

import { FilterTransactions } from "./";

let profile: Profile;

describe("FilterTransactions", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
	});

	it("should render", () => {
		const { container, getByRole } = render(<FilterTransactions />);
		expect(getByRole("button", { name: /Type/ })).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it("should render with default selected option", () => {
		const { container, getByRole } = render(
			<FilterTransactions defaultSelected={{ label: "All", value: "all" }} />,
		);
		expect(getByRole("button", { name: /Type/ })).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it("should open dropdown list with all transaction types", async () => {
		const { container, getByRole, getByTestId } = render(
			<FilterTransactions wallets={profile.wallets().values()} />,
		);
		expect(getByRole("button", { name: /Type/ })).toBeInTheDocument();
		act(() => {
			fireEvent.click(getByRole("button", { name: /Type/ }));
		});

		await waitFor(() => expect(getByTestId("dropdown__option--core-0")).toBeInTheDocument());
		expect(container).toMatchSnapshot();
	});

	it("should emit onChange", async () => {
		const onSelect = jest.fn();

		const { getByRole, getByTestId } = render(
			<FilterTransactions wallets={profile.wallets().values()} onSelect={onSelect} />,
		);
		expect(getByRole("button", { name: /Type/ })).toBeInTheDocument();

		act(() => {
			fireEvent.click(getByRole("button", { name: /Type/ }));
		});

		await waitFor(() => expect(getByTestId("dropdown__option--core-0")).toBeInTheDocument());

		act(() => {
			fireEvent.click(getByTestId("dropdown__option--core-0"));
		});

		expect(onSelect).toHaveBeenCalled();
	});
});
