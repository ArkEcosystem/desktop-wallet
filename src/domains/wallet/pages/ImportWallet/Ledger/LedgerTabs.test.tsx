import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import Transport, { Observer } from "@ledgerhq/hw-transport";
import { createTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import { LedgerProvider } from "app/contexts";
import nock from "nock";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, renderWithRouter, screen, waitFor } from "utils/testing-library";

import { LedgerTabs } from "./LedgerTabs";

describe("LedgerTabs", () => {
	let profile: Profile;
	let wallet: ReadWriteWallet;
	let transport: typeof Transport;
	let observer: Observer<any>;
	let publicKeyPaths = new Map();

	beforeAll(() => {
		nock("https://dwallets.ark.io/api")
			.get("/wallets/DJpFwW39QnQvQRQJF2MCfAoKvsX4DJ28jq")
			.reply(200, {
				data: {
					address: "DJpFwW39QnQvQRQJF2MCfAoKvsX4DJ28jq",
					balance: "0",
				},
			})
			.persist();
	});

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();
		transport = createTransportReplayer(RecordStore.fromString(""));
		publicKeyPaths = new Map([
			["44'/111'/0'/0/0", "027716e659220085e41389efc7cf6a05f7f7c659cf3db9126caabce6cda9156582"],
			["44'/111'/1'/0/0", wallet.publicKey()!],
			["44'/111'/2'/0/0", "020aac4ec02d47d306b394b79d3351c56c1253cd67fe2c1a38ceba59b896d584d1"],
		]);

		jest.spyOn(transport, "listen").mockImplementationOnce((obv) => {
			observer = obv;
			return { unsubscribe: jest.fn() };
		});

		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
	});

	const BaseComponent = ({ activeIndex }: { activeIndex: number }) => (
		<Route path="/profiles/:profileId">
			<LedgerProvider transport={transport}>
				<LedgerTabs activeIndex={activeIndex} />
			</LedgerProvider>
		</Route>
	);

	const nextSelector = () => screen.getByTestId("Paginator__continue-button");
	const backSelector = () => screen.getByTestId("Paginator__back-button");
	const submitSelector = () => screen.getByTestId("Paginator__submit-button");

	it("should render connection step", async () => {
		jest.setTimeout(10000);

		const getPublicKeySpy = jest
			.spyOn(wallet.coin().ledger(), "getPublicKey")
			.mockRejectedValue(new Error("Failed"));

		let formRef: ReturnType<typeof useForm>;
		const Component = () => {
			const form = useForm({ mode: "onChange" });
			formRef = form;

			return (
				<FormProvider {...form}>
					<BaseComponent activeIndex={1} />
				</FormProvider>
			);
		};

		const { container } = renderWithRouter(<Component />, { routes: [`/profiles/${profile.id()}`] });

		await waitFor(() => expect(screen.getByTestId("SelectNetwork")).toBeInTheDocument());
		await waitFor(() => expect(nextSelector()).toBeDisabled());
		await waitFor(() => expect(backSelector()).toBeDisabled());

		formRef!.setValue("network", wallet.network(), { shouldDirty: true, shouldValidate: true });

		expect(container).toMatchSnapshot();

		await waitFor(() => expect(nextSelector()).toBeEnabled());

		act(() => {
			fireEvent.click(nextSelector());
		});

		await waitFor(() => expect(screen.getByTestId("LedgerConnectionStep")).toBeInTheDocument());
		await waitFor(() => expect(screen.queryByText("Failed")).toBeInTheDocument(), { timeout: 10000 });

		act(() => {
			fireEvent.click(backSelector());
		});

		await waitFor(() => expect(screen.getByTestId("SelectNetwork")).toBeInTheDocument());
		await waitFor(() => expect(nextSelector()).toBeEnabled());

		getPublicKeySpy.mockReset();
	});

	it("should render scan step", async () => {
		const getPublicKeySpy = jest
			.spyOn(wallet.coin().ledger(), "getPublicKey")
			.mockImplementation((path) => Promise.resolve(publicKeyPaths.get(path)!));

		const Component = () => {
			const form = useForm({
				mode: "onChange",
				defaultValues: {
					network: wallet.network(),
				},
			});

			const { register } = form;

			useEffect(() => {
				register("network");
			}, [register]);

			return (
				<FormProvider {...form}>
					<BaseComponent activeIndex={2} />
				</FormProvider>
			);
		};

		renderWithRouter(<Component />, { routes: [`/profiles/${profile.id()}`] });

		await waitFor(() => expect(screen.getByTestId("LedgerConnectionStep")).toBeInTheDocument());

		// Auto redirect to next step
		await waitFor(() => expect(screen.getByTestId("LedgerScanStep")).toBeInTheDocument());
		await waitFor(() => expect(screen.getAllByRole("row")).toHaveLength(3));

		getPublicKeySpy.mockReset();
	});

	it("should render finish step", async () => {
		const getPublicKeySpy = jest
			.spyOn(wallet.coin().ledger(), "getPublicKey")
			.mockImplementation((path) => Promise.resolve(publicKeyPaths.get(path)!));

		const Component = () => {
			const form = useForm({
				mode: "onChange",
				defaultValues: {
					network: wallet.network(),
				},
			});

			const { register } = form;

			useEffect(() => {
				register("network");
			}, [register]);

			return (
				<FormProvider {...form}>
					<BaseComponent activeIndex={3} />
				</FormProvider>
			);
		};

		renderWithRouter(<Component />, { routes: [`/profiles/${profile.id()}`] });

		await waitFor(() => expect(screen.getByTestId("LedgerScanStep")).toBeInTheDocument());
		await waitFor(() => expect(screen.getAllByRole("row")).toHaveLength(3));

		expect(profile.wallets().values()).toHaveLength(2);

		act(() => {
			fireEvent.click(nextSelector());
		});

		await waitFor(() => expect(screen.getByTestId("LedgerImportStep")).toBeInTheDocument());

		// Import wallets before entering the last step
		expect(profile.wallets().values()).toHaveLength(4);

		act(() => {
			fireEvent.input(screen.getAllByTestId("ImportWallet__name-input")[1], {
				target: {
					value: "Custom Name",
				},
			});
		});

		act(() => {
			fireEvent.click(submitSelector());
		});

		await waitFor(() => expect(profile.wallets().last().alias()).toBe("Custom Name"));

		getPublicKeySpy.mockReset();
	});
});
