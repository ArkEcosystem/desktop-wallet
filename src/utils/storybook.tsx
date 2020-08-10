import { Coins, Contracts } from "@arkecosystem/platform-sdk";
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment, Profile, Wallet, WalletFlag, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";
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
			profile.wallets().importByAddress("D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax", "ARK", "devnet"),
			profile.wallets().importByAddress("D8vwEEvKgMPVvvK2Zwzyb5uHzRadurCcKq", "ARK", "devnet"),
			profile.wallets().importByAddress("DRgF3PvzeGWndQjET7dZsSmnrc6uAy23ES", "ARK", "devnet"),
		);

		const wallets = await Promise.all(promises);

		for (const walletIndex of Object.keys(wallets)) {
			const index = Number(walletIndex);

			if (!index) {
				wallets[index].toggleStarred();
				wallets[index].data().set(WalletFlag.Ledger, true);
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
	const [wallets, setWallets] = React.useState<Wallet[]>([]);
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
			setProfile(profileObject);
		}

		const wallets = await generateWallets({ env, profile: profile || profileObject, count });

		if (withDelegate) {
			setDelegate(await wallets[0].delegate("arkx"));
		}

		if (withDelegates) {
			setDelegates(await wallets[0].delegates());
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

	return <>{children({ delegate, delegates, env, profile, wallets })}</>;
};
