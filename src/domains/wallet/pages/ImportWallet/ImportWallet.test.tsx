/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/require-await */
import { Coins } from "@arkecosystem/platform-sdk";
import { Profile, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import Transport, { Observer } from "@ledgerhq/hw-transport";
import { createTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import { act, renderHook } from "@testing-library/react-hooks";
import { LedgerProvider } from "app/contexts";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Route } from "react-router-dom";
import {
	act as actAsync,
	env,
	fireEvent,
	getDefaultProfileId,
	render,
	RenderResult,
	renderWithRouter,
	screen,
	waitFor,
} from "utils/testing-library";

import { ImportWallet } from "./ImportWallet";
import { FirstStep } from "./Step1";
import { SecondStep } from "./Step2";
import { ThirdStep } from "./Step3";

let profile: Profile;
const fixtureProfileId = getDefaultProfileId();

const identityAddress = "DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq2P";
const mnemonic = "buddy year cost vendor honey tonight viable nut female alarm duck symptom";
const randomAddress = "D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib";

const route = `/profiles/${fixtureProfileId}/wallets/import`;

describe("ImportWallet", () => {
	beforeAll(() => {
		nock.disableNetConnect();

		nock("https://dwallets.ark.io")
			.get("/api/wallets/DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq2P")
			.reply(200, require("tests/fixtures/coins/ark/devnet/wallets/DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq2P.json"))
			.persist();
	});

	beforeEach(() => {
		profile = env.profiles().findById(fixtureProfileId);

		const walletId = profile.wallets().findByAddress(randomAddress)?.id();

		if (walletId) {
			profile.wallets().forget(walletId);
		}
	});

	it("should render 1st step", async () => {
		const { result: form } = renderHook(() => useForm());
		const { getByTestId, asFragment } = render(
			<FormProvider {...form.current}>
				<FirstStep profile={profile} />
			</FormProvider>,
		);

		expect(getByTestId("ImportWallet__first-step")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		const selectNetworkInput = getByTestId("SelectNetworkInput__input");
		expect(selectNetworkInput).toBeTruthy();

		await act(async () => {
			fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
		});

		await act(async () => {
			fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });
		});

		expect(selectNetworkInput).toHaveValue("ARK Devnet");
	});

	it("should render 1st step without test networks", async () => {
		profile.settings().set(ProfileSetting.UseTestNetworks, false);

		const { result: form } = renderHook(() => useForm());
		const { getByTestId, asFragment, queryByTestId } = render(
			<FormProvider {...form.current}>
				<FirstStep profile={profile} />
			</FormProvider>,
		);

		expect(getByTestId("ImportWallet__first-step")).toBeTruthy();

		const selectNetworkInput = getByTestId("SelectNetworkInput__input");
		expect(selectNetworkInput).toBeTruthy();

		act(() => {
			fireEvent.focus(selectNetworkInput);
		});

		expect(queryByTestId("NetworkIcon-ARK-ark.mainnet")).toBeInTheDocument();
		expect(queryByTestId("NetworkIcon-ARK-ark.devnet")).toBeNull();

		expect(asFragment()).toMatchSnapshot();

		profile.settings().set(ProfileSetting.UseTestNetworks, true);
	});

	it("should render 2st step", async () => {
		let form: ReturnType<typeof useForm>;

		const Component = () => {
			form = useForm({
				defaultValues: {
					network: {
						id: () => "ark.devnet",
						coin: () => "ARK",
					},
					type: "mnemonic",
				},
			});
			form.register("type");
			form.register("network");
			return (
				<FormProvider {...form}>
					<SecondStep profile={profile} />
				</FormProvider>
			);
		};

		const { container } = render(<Component />);

		expect(screen.getByTestId("ImportWallet__second-step")).toBeTruthy();

		await waitFor(() => expect(screen.getByTestId("ImportWallet__mnemonic-input")));

		const passphraseInput = screen.getByTestId("ImportWallet__mnemonic-input");
		expect(passphraseInput).toBeTruthy();

		fireEvent.change(passphraseInput, { target: { value: mnemonic } });

		await waitFor(() => {
			expect(form.getValues()).toMatchObject({ type: "mnemonic", value: mnemonic });
		});

		act(() => {
			fireEvent.focus(screen.getByTestId("SelectDropdownInput__input"));
		});

		await waitFor(() => expect(screen.getByTestId("select-list__toggle-option-1")).toBeInTheDocument());

		act(() => {
			fireEvent.mouseDown(screen.getByTestId("select-list__toggle-option-1"));
		});

		await waitFor(() => expect(screen.getByTestId("ImportWallet__address-input")).toBeInTheDocument());

		expect(container).toMatchSnapshot();
	});

	it("should render 3st step", async () => {
		let form: ReturnType<typeof useForm>;
		const Component = () => {
			form = useForm({
				defaultValues: {
					network: {
						id: () => "ark.devnet",
						coin: () => "ARK",
						ticker: () => "DARK",
					},
					type: "mnemonic",
				},
			});

			return (
				<FormProvider {...form}>
					<ThirdStep
						address={identityAddress}
						balance={BigNumber.make(80)}
						nameMaxLength={42}
						profile={profile}
					/>
				</FormProvider>
			);
		};

		const { getByTestId, getByText, asFragment } = render(<Component />);

		expect(getByTestId("ImportWallet__third-step")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		expect(getByText("ARK Devnet")).toBeTruthy();
		expect(getByText(identityAddress)).toBeTruthy();

		const walletNameInput = getByTestId("ImportWallet__name-input");

		await act(async () => {
			fireEvent.change(walletNameInput, { target: { value: "Test" } });
		});

		expect(form.getValues()).toEqual({ name: "Test" });
	});

	it("should go back to dashboard", async () => {
		const history = createMemoryHistory();
		history.push(route);

		let rendered: RenderResult;

		const historySpy = jest.spyOn(history, "push").mockImplementationOnce();

		await actAsync(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/import">
					<ImportWallet />
				</Route>,
				{
					routes: [route],
					history,
				},
			);
			await waitFor(() => expect(rendered.getByTestId("ImportWallet__first-step")).toBeTruthy());
		});

		const { getByTestId } = rendered;

		const backButton = getByTestId("ImportWallet__back-button");
		expect(backButton).toBeTruthy();
		expect(backButton).not.toHaveAttribute("disabled");

		await fireEvent.click(backButton);

		expect(historySpy).toHaveBeenCalledWith(`/profiles/${fixtureProfileId}/dashboard`);

		historySpy.mockRestore();
	});

	it("should go to previous step", async () => {
		const history = createMemoryHistory();
		history.push(route);

		let rendered: RenderResult;

		await actAsync(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/import">
					<ImportWallet />
				</Route>,
				{
					routes: [route],
					history,
				},
			);
			await waitFor(() => expect(rendered.getByTestId("ImportWallet__first-step")).toBeTruthy());
		});

		const { getByTestId, asFragment } = rendered;

		expect(asFragment()).toMatchSnapshot();

		await actAsync(async () => {
			const selectNetworkInput = getByTestId("SelectNetworkInput__input");
			expect(selectNetworkInput).toBeTruthy();

			await fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
			await fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

			expect(selectNetworkInput).toHaveValue("ARK Devnet");

			const continueButton = getByTestId("ImportWallet__continue-button");
			expect(continueButton).toBeTruthy();
			expect(continueButton).not.toHaveAttribute("disabled");

			await fireEvent.click(continueButton);

			await waitFor(() => {
				expect(getByTestId("ImportWallet__second-step")).toBeTruthy();
			});

			await fireEvent.click(getByTestId("ImportWallet__back-button"));

			await waitFor(() => {
				expect(getByTestId("ImportWallet__first-step")).toBeTruthy();
			});
		});
	});

	it("should import by mnemonic", async () => {
		const history = createMemoryHistory();
		history.push(route);

		let rendered: RenderResult;

		await actAsync(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/import">
					<ImportWallet />
				</Route>,
				{
					routes: [route],
					history,
				},
			);
			await waitFor(() => expect(rendered.getByTestId("ImportWallet__first-step")).toBeTruthy());
		});

		const { getByTestId, asFragment } = rendered;

		expect(asFragment()).toMatchSnapshot();

		await actAsync(async () => {
			const selectNetworkInput = getByTestId("SelectNetworkInput__input");
			expect(selectNetworkInput).toBeTruthy();

			await fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
			await fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

			expect(selectNetworkInput).toHaveValue("ARK Devnet");

			let continueButton = getByTestId("ImportWallet__continue-button");

			expect(continueButton).toBeTruthy();
			expect(continueButton).not.toHaveAttribute("disabled");

			await fireEvent.click(continueButton);

			await waitFor(() => {
				expect(getByTestId("ImportWallet__second-step")).toBeTruthy();
			});

			const passphraseInput = getByTestId("ImportWallet__mnemonic-input");
			expect(passphraseInput).toBeTruthy();

			await fireEvent.input(passphraseInput, { target: { value: mnemonic } });

			continueButton = getByTestId("ImportWallet__continue-button");

			expect(continueButton).toBeTruthy();
			await waitFor(() => {
				expect(continueButton).not.toHaveAttribute("disabled");
			});

			await fireEvent.click(continueButton);

			await waitFor(() => {
				expect(getByTestId("ImportWallet__third-step")).toBeTruthy();
			});

			const submitButton = getByTestId("ImportWallet__save-button");
			expect(submitButton).toBeTruthy();
			await waitFor(() => {
				expect(submitButton).not.toHaveAttribute("disabled");
			});

			await fireEvent.click(submitButton);

			await waitFor(() => {
				expect(profile.wallets().findByAddress(identityAddress)).toBeTruthy();
			});
		});
	});

	it("should import by address", async () => {
		const history = createMemoryHistory();
		history.push(route);

		let rendered: RenderResult;

		history.push(route);

		await actAsync(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/import">
					<ImportWallet />
				</Route>,
				{
					routes: [route],
					history,
				},
			);
			await waitFor(() => expect(rendered.getByTestId("ImportWallet__first-step")).toBeTruthy());
		});

		const { getByTestId, queryByTestId, asFragment } = rendered;

		expect(asFragment()).toMatchSnapshot();

		await actAsync(async () => {
			const selectNetworkInput = getByTestId("SelectNetworkInput__input");
			expect(selectNetworkInput).toBeTruthy();

			await fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
			await fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

			expect(selectNetworkInput).toHaveValue("ARK Devnet");

			let continueButton = getByTestId("ImportWallet__continue-button");

			expect(continueButton).toBeTruthy();
			expect(continueButton).not.toHaveAttribute("disabled");

			await fireEvent.click(continueButton);

			await waitFor(() => {
				expect(getByTestId("ImportWallet__second-step")).toBeTruthy();
			});

			act(() => {
				fireEvent.focus(screen.getByTestId("SelectDropdownInput__input"));
			});

			await waitFor(() => expect(screen.getByTestId("select-list__toggle-option-1")).toBeInTheDocument());

			act(() => {
				fireEvent.mouseDown(screen.getByTestId("select-list__toggle-option-1"));
			});

			await waitFor(() => expect(queryByTestId("ImportWallet__address-input")).toBeInTheDocument());
			const addressInput = getByTestId("ImportWallet__address-input");
			expect(addressInput).toBeTruthy();

			await fireEvent.input(addressInput, { target: { value: randomAddress } });

			continueButton = getByTestId("ImportWallet__continue-button");

			expect(continueButton).toBeTruthy();
			await waitFor(() => {
				expect(continueButton).not.toHaveAttribute("disabled");
			});

			await fireEvent.click(continueButton);

			await waitFor(() => {
				expect(getByTestId("ImportWallet__third-step")).toBeTruthy();
			});

			const submitButton = getByTestId("ImportWallet__save-button");
			expect(submitButton).toBeTruthy();
			await waitFor(() => {
				expect(submitButton).not.toHaveAttribute("disabled");
			});

			await fireEvent.click(submitButton);

			await waitFor(() => {
				expect(profile.wallets().findByAddress(randomAddress)).toBeTruthy();
			});
		});
	});

	it("should import by address and fill a wallet name", async () => {
		const networkMock = jest.spyOn(env, "availableNetworks").mockReturnValue([
			new Coins.Network("ARK", {
				id: "ark.devnet",
				type: "test",
				name: "ARK Devnet",
				explorer: "https://dexplorer.ark.io/",
				currency: { ticker: "DARK", symbol: "DѦ" },
				crypto: { slip44: 111 },
				networking: { hosts: ["https://dwallets.ark.io"], hostsMultiSignature: [] },
				governance: { voting: { enabled: false, maximumPerWallet: 1, maximumPerTransaction: 1 } },
			}),
		]);

		const history = createMemoryHistory();
		history.push(route);

		let rendered: RenderResult;

		history.push(route);

		await actAsync(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/import">
					<ImportWallet />
				</Route>,
				{
					routes: [route],
					history,
				},
			);
			await waitFor(() => expect(rendered.getByTestId("ImportWallet__first-step")).toBeTruthy());
		});

		const { getByTestId, asFragment, queryByTestId } = rendered;

		expect(asFragment()).toMatchSnapshot();

		await actAsync(async () => {
			const selectNetworkInput = getByTestId("SelectNetworkInput__input");
			expect(selectNetworkInput).toBeTruthy();

			await fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
			await fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

			expect(selectNetworkInput).toHaveValue("ARK Devnet");

			let continueButton = getByTestId("ImportWallet__continue-button");

			expect(continueButton).toBeTruthy();
			expect(continueButton).not.toHaveAttribute("disabled");

			await fireEvent.click(continueButton);

			await waitFor(() => {
				expect(getByTestId("ImportWallet__second-step")).toBeTruthy();
			});

			act(() => {
				fireEvent.focus(screen.getByTestId("SelectDropdownInput__input"));
			});

			await waitFor(() => expect(screen.getByTestId("select-list__toggle-option-1")).toBeInTheDocument());

			act(() => {
				fireEvent.mouseDown(screen.getByTestId("select-list__toggle-option-1"));
			});
			await waitFor(() => expect(queryByTestId("ImportWallet__address-input")).toBeInTheDocument());
			const addressInput = getByTestId("ImportWallet__address-input");
			expect(addressInput).toBeTruthy();

			await fireEvent.input(addressInput, { target: { value: randomAddress } });

			continueButton = getByTestId("ImportWallet__continue-button");

			expect(continueButton).toBeTruthy();
			await waitFor(() => {
				expect(continueButton).not.toHaveAttribute("disabled");
			});

			await fireEvent.click(continueButton);

			await waitFor(() => {
				expect(getByTestId("ImportWallet__third-step")).toBeTruthy();
			});

			const walletNameInput = getByTestId("ImportWallet__name-input");
			expect(walletNameInput).toBeTruthy();

			await fireEvent.input(walletNameInput, { target: { value: "Test" } });

			const submitButton = getByTestId("ImportWallet__save-button");
			expect(submitButton).toBeTruthy();
			await waitFor(() => {
				expect(submitButton).not.toHaveAttribute("disabled");
			});

			await fireEvent.click(submitButton);

			await waitFor(() => {
				expect(profile.wallets().findByAddress(randomAddress)).toBeTruthy();
			});

			networkMock.mockRestore();
		});
	});

	it("should show an error message for invalid address", async () => {
		const history = createMemoryHistory();
		history.push(route);

		let rendered: RenderResult;

		history.push(route);

		await actAsync(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/import">
					<ImportWallet />
				</Route>,
				{
					routes: [route],
					history,
				},
			);
			await waitFor(() => expect(rendered.getByTestId("ImportWallet__first-step")).toBeTruthy());
		});

		const { getByTestId, asFragment, queryByTestId } = rendered;

		expect(asFragment()).toMatchSnapshot();

		await actAsync(async () => {
			const selectNetworkInput = getByTestId("SelectNetworkInput__input");
			expect(selectNetworkInput).toBeTruthy();

			await fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
			await fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

			expect(selectNetworkInput).toHaveValue("ARK Devnet");

			let continueButton = getByTestId("ImportWallet__continue-button");

			expect(continueButton).toBeTruthy();
			expect(continueButton).not.toHaveAttribute("disabled");

			await fireEvent.click(continueButton);

			await waitFor(() => {
				expect(getByTestId("ImportWallet__second-step")).toBeTruthy();
			});

			act(() => {
				fireEvent.focus(screen.getByTestId("SelectDropdownInput__input"));
			});

			await waitFor(() => expect(screen.getByTestId("select-list__toggle-option-1")).toBeInTheDocument());

			act(() => {
				fireEvent.mouseDown(screen.getByTestId("select-list__toggle-option-1"));
			});
			await waitFor(() => expect(queryByTestId("ImportWallet__address-input")).toBeInTheDocument());

			const addressInput = getByTestId("ImportWallet__address-input");
			expect(addressInput).toBeTruthy();

			await fireEvent.input(addressInput, { target: { value: "123" } });

			await waitFor(() => {
				expect(getByTestId("Input-error")).toBeVisible();
			});

			continueButton = getByTestId("ImportWallet__continue-button");

			expect(continueButton).toBeTruthy();
			await waitFor(() => {
				expect(continueButton).toBeDisabled();
			});
		});
	});

	it("should show an error message for duplicate address", async () => {
		const history = createMemoryHistory();
		history.push(route);

		let rendered: RenderResult;

		history.push(route);

		await actAsync(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/import">
					<ImportWallet />
				</Route>,
				{
					routes: [route],
					history,
				},
			);
			await waitFor(() => expect(rendered.getByTestId("ImportWallet__first-step")).toBeTruthy());
		});

		const { getByTestId, asFragment, queryByTestId } = rendered;

		expect(asFragment()).toMatchSnapshot();

		await actAsync(async () => {
			const selectNetworkInput = getByTestId("SelectNetworkInput__input");
			expect(selectNetworkInput).toBeTruthy();

			await fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
			await fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

			expect(selectNetworkInput).toHaveValue("ARK Devnet");

			let continueButton = getByTestId("ImportWallet__continue-button");

			expect(continueButton).toBeTruthy();
			expect(continueButton).not.toHaveAttribute("disabled");

			await fireEvent.click(continueButton);

			await waitFor(() => {
				expect(getByTestId("ImportWallet__second-step")).toBeTruthy();
			});

			const passphraseInput = getByTestId("ImportWallet__mnemonic-input");
			expect(passphraseInput).toBeTruthy();

			await fireEvent.input(passphraseInput, { target: { value: mnemonic } });

			await waitFor(() => {
				expect(getByTestId("Input-error")).toBeVisible();
			});

			act(() => {
				fireEvent.focus(screen.getByTestId("SelectDropdownInput__input"));
			});

			await waitFor(() => expect(screen.getByTestId("select-list__toggle-option-1")).toBeInTheDocument());

			act(() => {
				fireEvent.mouseDown(screen.getByTestId("select-list__toggle-option-1"));
			});
			await waitFor(() => expect(queryByTestId("ImportWallet__address-input")).toBeInTheDocument());

			const addressInput = getByTestId("ImportWallet__address-input");
			expect(addressInput).toBeTruthy();

			await fireEvent.input(addressInput, { target: { value: identityAddress } });

			await waitFor(() => {
				expect(getByTestId("Input-error")).toBeVisible();
			});

			continueButton = getByTestId("ImportWallet__continue-button");

			expect(continueButton).toBeTruthy();
			await waitFor(() => {
				expect(continueButton).toBeDisabled();
			});
		});
	});

	it("should show an error message for duplicate name", async () => {
		const history = createMemoryHistory();
		history.push(route);

		let rendered: RenderResult;

		history.push(route);

		await actAsync(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/import">
					<ImportWallet />
				</Route>,
				{
					routes: [route],
					history,
				},
			);
			await waitFor(() => expect(rendered.getByTestId("ImportWallet__first-step")).toBeTruthy());
		});

		const { getByTestId, asFragment, getByText } = rendered;

		expect(asFragment()).toMatchSnapshot();

		await actAsync(async () => {
			const selectNetworkInput = getByTestId("SelectNetworkInput__input");
			expect(selectNetworkInput).toBeTruthy();

			await fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
			await fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

			expect(selectNetworkInput).toHaveValue("ARK Devnet");

			let continueButton = getByTestId("ImportWallet__continue-button");

			expect(continueButton).toBeTruthy();
			expect(continueButton).not.toHaveAttribute("disabled");

			await fireEvent.click(continueButton);

			await waitFor(() => {
				expect(getByTestId("ImportWallet__second-step")).toBeTruthy();
			});

			const passphraseInput = getByTestId("ImportWallet__mnemonic-input");
			expect(passphraseInput).toBeTruthy();

			await fireEvent.input(passphraseInput, { target: { value: "this is a top secret passphrase" } });

			continueButton = getByTestId("ImportWallet__continue-button");

			expect(continueButton).toBeTruthy();
			await waitFor(() => {
				expect(continueButton).not.toHaveAttribute("disabled");
			});

			await fireEvent.click(continueButton);

			await waitFor(() => {
				expect(getByTestId("ImportWallet__third-step")).toBeTruthy();
			});

			const walletNameInput = getByTestId("ImportWallet__name-input");
			expect(walletNameInput).toBeTruthy();

			await fireEvent.input(walletNameInput, { target: { value: profile.wallets().first().alias() } });

			const submitButton = getByTestId("ImportWallet__save-button");

			expect(submitButton).toBeTruthy();
			await waitFor(() => {
				expect(submitButton).toBeDisabled();
			});
		});
	});

	it("should empty all wallets and import by address", async () => {
		profile.wallets().flush();

		const history = createMemoryHistory();
		history.push(route);

		let rendered: RenderResult;

		history.push(route);

		await actAsync(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/import">
					<ImportWallet />
				</Route>,
				{
					routes: [route],
					history,
				},
			);
			await waitFor(() => expect(rendered.getByTestId("ImportWallet__first-step")).toBeTruthy());
		});

		const { getByTestId, asFragment, queryByTestId } = rendered;

		expect(asFragment()).toMatchSnapshot();

		await actAsync(async () => {
			const selectNetworkInput = getByTestId("SelectNetworkInput__input");
			expect(selectNetworkInput).toBeTruthy();

			await fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
			await fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });

			expect(selectNetworkInput).toHaveValue("ARK Devnet");

			let continueButton = getByTestId("ImportWallet__continue-button");

			expect(continueButton).toBeTruthy();
			expect(continueButton).not.toHaveAttribute("disabled");

			await fireEvent.click(continueButton);

			await waitFor(() => {
				expect(getByTestId("ImportWallet__second-step")).toBeTruthy();
			});

			act(() => {
				fireEvent.focus(screen.getByTestId("SelectDropdownInput__input"));
			});

			await waitFor(() => expect(screen.getByTestId("select-list__toggle-option-1")).toBeInTheDocument());

			act(() => {
				fireEvent.mouseDown(screen.getByTestId("select-list__toggle-option-1"));
			});
			await waitFor(() => expect(queryByTestId("ImportWallet__address-input")).toBeInTheDocument());

			const addressInput = getByTestId("ImportWallet__address-input");
			expect(addressInput).toBeTruthy();

			await fireEvent.input(addressInput, { target: { value: randomAddress } });

			continueButton = getByTestId("ImportWallet__continue-button");

			expect(continueButton).toBeTruthy();
			await waitFor(() => {
				expect(continueButton).not.toHaveAttribute("disabled");
			});

			await fireEvent.click(continueButton);

			await waitFor(() => {
				expect(getByTestId("ImportWallet__third-step")).toBeTruthy();
			});

			const submitButton = getByTestId("ImportWallet__save-button");
			expect(submitButton).toBeTruthy();
			await waitFor(() => {
				expect(submitButton).not.toHaveAttribute("disabled");
			});

			await fireEvent.click(submitButton);

			await waitFor(() => {
				expect(profile.wallets().findByAddress(randomAddress)).toBeTruthy();
			});
		});
	});

	it("should render as ledger import", async () => {
		const transport: typeof Transport = createTransportReplayer(RecordStore.fromString(""));
		let observer: Observer<any>;
		jest.spyOn(transport, "listen").mockImplementationOnce((obv) => {
			observer = obv;
			return { unsubscribe: jest.fn() };
		});

		const history = createMemoryHistory();

		history.push({
			pathname: route,
			search: `?ledger=true`,
		});

		const { getByTestId, container } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/import">
				<LedgerProvider transport={transport}>
					<ImportWallet />
				</LedgerProvider>
			</Route>,
			{
				routes: [route],
				history,
			},
		);

		expect(container).toMatchSnapshot();
		await waitFor(() => expect(getByTestId("LedgerTabs")).toBeInTheDocument());
	});
});
