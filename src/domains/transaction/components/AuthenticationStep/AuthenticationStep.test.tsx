import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { renderHook } from "@testing-library/react-hooks";
import { Form } from "app/components/Form";
import React from "react";
import { useForm } from "react-hook-form";
import { act, env, fireEvent, getDefaultProfileId, renderWithRouter, screen, waitFor } from "utils/testing-library";

import { AuthenticationStep } from "./AuthenticationStep";

describe("AuthenticationStep", () => {
	let wallet: ReadWriteWallet;
	let profile: Profile;

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();
	});

	const Component = ({ form }: any) => (
		<Form context={form} onSubmit={() => void 0}>
			<AuthenticationStep wallet={wallet} />
		</Form>
	);

	it("should request mnemonic", async () => {
		jest.spyOn(wallet, "isSecondSignature").mockReturnValueOnce(false);

		const { result } = renderHook(() => useForm({ mode: "onChange" }));
		const { asFragment, queryByTestId, getByTestId } = renderWithRouter(<Component form={result.current} />);

		await waitFor(() => expect(screen.queryByTestId("AuthenticationStep__second-mnemonic")).toBeNull());
		expect(queryByTestId("AuthenticationStep__mnemonic")).toBeInTheDocument();

		act(() => {
			fireEvent.change(getByTestId("AuthenticationStep__mnemonic"), {
				target: {
					value: "my mnemonic",
				},
			});
		});
		await waitFor(() => expect(getByTestId("AuthenticationStep__mnemonic")).toHaveValue("my mnemonic"));

		expect(result.current.getValues()).toEqual({ mnemonic: "my mnemonic" });
		expect(asFragment()).toMatchSnapshot();
	});

	it("should request mnemonic and second mnemonic", async () => {
		jest.spyOn(wallet, "isSecondSignature").mockReturnValueOnce(true);

		const { result } = renderHook(() => useForm({ mode: "onChange" }));
		const { asFragment, queryByTestId, getByTestId } = renderWithRouter(<Component form={result.current} />);

		expect(queryByTestId("AuthenticationStep__second-mnemonic")).toBeInTheDocument();
		expect(queryByTestId("AuthenticationStep__mnemonic")).toBeInTheDocument();

		act(() => {
			fireEvent.change(getByTestId("AuthenticationStep__mnemonic"), {
				target: {
					value: "my mnemonic",
				},
			});
		});

		await waitFor(() => expect(getByTestId("AuthenticationStep__mnemonic")).toHaveValue("my mnemonic"));

		act(() => {
			fireEvent.change(getByTestId("AuthenticationStep__second-mnemonic"), {
				target: {
					value: "my second mnemonic",
				},
			});
		});

		await waitFor(() =>
			expect(getByTestId("AuthenticationStep__second-mnemonic")).toHaveValue("my second mnemonic"),
		);

		expect(result.current.getValues()).toEqual({ mnemonic: "my mnemonic", secondMnemonic: "my second mnemonic" });
		expect(asFragment()).toMatchSnapshot();
	});

	it("should show only ledger confirmation", () => {
		jest.spyOn(wallet, "isLedger").mockReturnValueOnce(true);

		const { result } = renderHook(() => useForm({ mode: "onChange" }));
		const { asFragment, queryByTestId } = renderWithRouter(<Component form={result.current} />);

		expect(queryByTestId("LedgerConfirmation-description")).toBeInTheDocument();
		expect(queryByTestId("AuthenticationStep__second-mnemonic")).toBeNull();
		expect(queryByTestId("AuthenticationStep__mnemonic")).toBeNull();

		expect(asFragment()).toMatchSnapshot();
	});
});
