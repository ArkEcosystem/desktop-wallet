/* eslint-disable @typescript-eslint/require-await */
import { Profile, ReadWriteWallet, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import { translations as commonTranslations } from "app/i18n/common/i18n";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, waitFor } from "testing-library";

import { translations } from "../../i18n";
import { UpdateWalletName } from "./UpdateWalletName";

let profile: Profile;
let wallet: ReadWriteWallet;

describe("UpdateWalletName", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");
	});

	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(
			<UpdateWalletName
				walletId={wallet.id()}
				currentAlias={wallet.alias()}
				profile={profile}
				isOpen={false}
				onSave={() => void 0}
			/>,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(
			<UpdateWalletName
				walletId={wallet.id()}
				currentAlias={wallet.alias()}
				profile={profile}
				isOpen={true}
				onSave={() => void 0}
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_NAME_WALLET.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_NAME_WALLET.DESCRIPTION);
		expect(getByTestId("modal__inner")).toHaveTextContent(commonTranslations.NAME);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should rename wallet", () => {
		const onSave = jest.fn();

		const { getByTestId } = render(
			<UpdateWalletName
				walletId={wallet.id()}
				currentAlias={wallet.alias()}
				profile={profile}
				isOpen={true}
				onSave={onSave}
			/>,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_NAME_WALLET.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_NAME_WALLET.DESCRIPTION);
		expect(getByTestId("modal__inner")).toHaveTextContent(commonTranslations.NAME);

		const input = getByTestId("UpdateWalletName__input");
		const name = "Sample label";

		act(() => {
			fireEvent.change(input, { target: { value: name } });
		});

		expect(input).toHaveValue(name);

		const submitBtn = getByTestId("UpdateWalletName__submit");

		act(() => {
			fireEvent.click(submitBtn);
		});

		waitFor(() => {
			expect(onSave).toHaveBeenCalledWith({ name }, expect.anything());
			wallet.settings().set(WalletSetting.Alias, name);
			expect(wallet.settings().get(WalletSetting.Alias)).toEqual(name);
		});
	});

	it("should show an error message for duplicate name", async () => {
		const onSave = jest.fn();

		const { asFragment, findByTestId, getByTestId, getByText } = render(
			<UpdateWalletName
				walletId={wallet.id()}
				currentAlias={wallet.alias()}
				profile={profile}
				isOpen={true}
				onSave={onSave}
			/>,
		);

		const nameVariations = ["ARK Wallet 2", "ark wallet 2", " ARK Wallet 2", "ARK Wallet 2 "];

		for (const name of nameVariations) {
			await act(async () => {
				fireEvent.input(getByTestId("UpdateWalletName__input"), { target: { value: name } });
			});

			expect(getByTestId("Input-error")).toBeVisible();
			expect(getByTestId("UpdateWalletName__submit")).toBeDisabled();

			expect(asFragment()).toMatchSnapshot();
		}
	});

	it("should show error message when name consists only of whitespace", async () => {
		const onSave = jest.fn();

		const { asFragment, findByTestId, getByTestId } = render(
			<UpdateWalletName
				walletId={wallet.id()}
				currentAlias={wallet.alias()}
				profile={profile}
				isOpen={true}
				onSave={onSave}
			/>,
		);

		await act(async () => {
			fireEvent.input(getByTestId("UpdateWalletName__input"), { target: { value: "      " } });
		});

		// wait for formState.isValid to be updated
		await findByTestId("UpdateWalletName__submit");

		expect(getByTestId("UpdateWalletName__submit")).toBeDisabled();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should show error message when name exceeds 42 characters", async () => {
		const onSave = jest.fn();

		const { asFragment, findByTestId, getByTestId } = render(
			<UpdateWalletName
				walletId={wallet.id()}
				currentAlias={wallet.alias()}
				profile={profile}
				isOpen={true}
				onSave={onSave}
			/>,
		);

		await act(async () => {
			fireEvent.input(getByTestId("UpdateWalletName__input"), {
				target: { value: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet fugit distinctio" },
			});
		});

		// wait for formState.isValid to be updated
		await findByTestId("UpdateWalletName__submit");

		expect(getByTestId("UpdateWalletName__submit")).toBeDisabled();
		expect(asFragment()).toMatchSnapshot();
	});
});
