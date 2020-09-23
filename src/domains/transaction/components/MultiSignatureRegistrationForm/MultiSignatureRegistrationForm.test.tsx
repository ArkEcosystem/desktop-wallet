import { Contracts } from "@arkecosystem/platform-sdk";
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { renderHook } from "@testing-library/react-hooks";
import { Form } from "app/components/Form";
import React from "react";
import { useForm } from "react-hook-form";
import { act, env, fireEvent, getDefaultProfileId, render, screen, syncFees, waitFor } from "utils/testing-library";

import { translations as transactionTranslations } from "../../i18n";
import { MultiSignatureRegistrationForm } from "./MultiSignatureRegistrationForm";

describe("MultiSignature Registration Form", () => {
	let profile: Profile;
	let wallet: ReadWriteWallet;
	let wallet2: ReadWriteWallet;
	let fees: Contracts.TransactionFee;

	beforeAll(async () => {
		await syncFees();
	});

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();
		wallet2 = profile.wallets().last();
		fees = {
			static: "0",
			min: "0",
			max: (10 * 1e8).toFixed(0),
			avg: (1.354 * 1e8).toFixed(0),
		};
	});

	const Component = ({
		form,
		onSubmit = () => void 0,
		activeTab = 2,
	}: {
		form: ReturnType<typeof useForm>;
		onSubmit?: () => void;
		activeTab?: number;
	}) => (
		<Form context={form} onSubmit={onSubmit}>
			<MultiSignatureRegistrationForm.component
				profile={profile}
				activeTab={activeTab}
				fees={fees}
				wallet={wallet}
			/>
		</Form>
	);

	it("should render form step", async () => {
		const { result, waitForNextUpdate } = renderHook(() => useForm());
		const { asFragment } = render(<Component form={result.current} />);
		await waitForNextUpdate();
		await waitFor(() => expect(screen.queryAllByRole("row")).toHaveLength(1));
		expect(asFragment()).toMatchSnapshot();
	});

	it("should set fee", async () => {
		const { result, waitForNextUpdate } = renderHook(() => useForm());
		result.current.register("fee");

		render(<Component form={result.current} />);
		await waitForNextUpdate();

		act(() => {
			fireEvent.click(screen.getByText(transactionTranslations.FEES.AVERAGE));
		});

		await waitFor(() => expect(result.current.getValues("fee")).toBe("135400000"));
	});

	it("should render review step", () => {
		const { result } = renderHook(() =>
			useForm({
				defaultValues: {
					fee: fees.avg,
					participants: [
						{
							address: wallet.address(),
							publicKey: wallet.publicKey()!,
							balance: wallet.balance().toString(),
						},
						{
							address: wallet2.address(),
							publicKey: wallet2.publicKey()!,
							balance: wallet2.balance().toString(),
						},
					],
					minParticipants: 2,
				},
			}),
		);

		const { asFragment } = render(<Component activeTab={3} form={result.current} />);

		expect(screen.getByText(transactionTranslations.MULTISIGNATURE.PARTICIPANTS)).toBeInTheDocument();
		expect(screen.getByText(transactionTranslations.MULTISIGNATURE.MIN_SIGNATURES)).toBeInTheDocument();

		expect(asFragment()).toMatchSnapshot();
	});
});
