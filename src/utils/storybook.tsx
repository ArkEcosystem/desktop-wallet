import { Coins, Contracts } from "@arkecosystem/platform-sdk";
import { ARK } from "@arkecosystem/platform-sdk-ark";
import {
	Environment,
	Profile,
	ProfileSetting,
	ReadWriteWallet,
	WalletFlag,
	WalletSetting,
} from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";
import { PlatformSdkChoices } from "data";
import React from "react";
import { StubStorage } from "tests/mocks";

type WalletsDecoratorProps = {
	count: Number;
	children: any;
	withDelegate?: boolean;
	withDelegates?: boolean;
};

// TODO: Implement generate & count when mocking is in SDK
export const generateWallets = async ({
	env,
	profile,
	count,
}: {
	env: Environment;
	profile: Profile;
	count?: Number;
}) => {
	const promises = [];

	try {
		promises.push(
			profile.wallets().importByAddress("D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax", "ARK", "ark.devnet"),
			profile.wallets().importByAddress("D8vwEEvKgMPVvvK2Zwzyb5uHzRadurCcKq", "ARK", "ark.devnet"),
			profile.wallets().importByAddress("DRgF3PvzeGWndQjET7dZsSmnrc6uAy23ES", "ARK", "ark.devnet"),
		);

		const wallets = await Promise.all(promises);

		for (const walletIndex of Object.keys(wallets)) {
			const index = Number(walletIndex);

			if (!index) {
				wallets[index].toggleStarred();
				wallets[index].data().set(WalletFlag.LedgerIndex, 0);
			}

			wallets[index].settings().set(WalletSetting.Alias, `ARK Wallet ${index + 1}`);
		}

		await env.persist();

		return wallets;
	} catch (e) {
		console.error("Couldn't import addresses: ", e);
	}

	return profile.wallets().values();
};

const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });

export const WalletsDecorator = ({ count, children, withDelegate, withDelegates }: WalletsDecoratorProps) => {
	const [wallets, setWallets] = React.useState<ReadWriteWallet[]>([]);
	const [profile, setProfile] = React.useState<Profile>((null as unknown) as Profile);
	const [delegate, setDelegate] = React.useState<Contracts.WalletData>((null as unknown) as Contracts.WalletData);
	const [delegates, setDelegates] = React.useState<Coins.WalletDataCollection>(
		(null as unknown) as Coins.WalletDataCollection,
	);

	const loadData = async () => {
		let profileObject;
		if (!profile) {
			const existingProfile = env
				.profiles()
				.values()
				.find((profile) => profile.name() === "John Doe");

			if (existingProfile) {
				env.profiles().forget(existingProfile.id());
			}

			profileObject = env.profiles().create("John Doe");

			profileObject.settings().set(ProfileSetting.AdvancedMode, false);
			profileObject.settings().set(ProfileSetting.AutomaticSignOutPeriod, 15);
			profileObject.settings().set(ProfileSetting.Bip39Locale, PlatformSdkChoices.passphraseLanguages[2].value);
			profileObject.settings().set(ProfileSetting.ExchangeCurrency, PlatformSdkChoices.currencies[0].value);
			profileObject.settings().set(ProfileSetting.LedgerUpdateMethod, false);
			profileObject.settings().set(ProfileSetting.Locale, PlatformSdkChoices.languages[0].value);
			profileObject.settings().set(ProfileSetting.MarketProvider, PlatformSdkChoices.marketProviders[0].value);
			profileObject.settings().set(ProfileSetting.ScreenshotProtection, true);
			profileObject.settings().set(ProfileSetting.Theme, "light");
			profileObject.settings().set(ProfileSetting.TimeFormat, PlatformSdkChoices.timeFormats[0].value);

			setProfile(profileObject);
		}

		const wallets = await generateWallets({ env, profile: profile || profileObject, count });

		if (withDelegate) {
			setDelegate(await wallets[0].client().delegate("arkx"));
		}

		if (withDelegates) {
			setDelegates(await wallets[0].client().delegates());
		}

		setWallets(wallets);

		await env.persist();
	};

	React.useEffect(() => {
		loadData();
	}, []);

	if (wallets.length === 0) {
		return <>Loading Wallets</>;
	}

	return (
		<>
			{children({
				args: {
					delegate,
					delegates,
					env,
					profile,
					wallets,
				},
			})}
		</>
	);
};
