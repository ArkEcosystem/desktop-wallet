import { Coins, Contracts } from "@arkecosystem/platform-sdk";
import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment, Profile, Wallet } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";
import React from "react";
import { StubStorage } from "tests/mocks";

type WalletsDecoratorProps = {
	count: Number;
	children: any;
	withDelegate?: boolean;
	withDelegates?: boolean;
};

export const setupEnvironment = () => {
	const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
	const profile = env.profiles().create("John Doe");

	return { env, profile };
};

// TODO: Implement generate & count when mocking is in SDK
export const generateWallets = async (profile: Profile, setWallets: any, count = 2) => {
	const promises = [
		profile.wallets().importByAddress("D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax", "ARK", "devnet"),
		profile.wallets().importByAddress("D8vwEEvKgMPVvvK2Zwzyb5uHzRadurCcKq", "ARK", "devnet"),
		profile.wallets().importByAddress("DRgF3PvzeGWndQjET7dZsSmnrc6uAy23ES", "ARK", "devnet"),
	];

	return Promise.all(promises);
};

export const WalletsDecorator = ({ count, children, withDelegate, withDelegates }: WalletsDecoratorProps) => {
	const { profile } = setupEnvironment();
	const [wallets, setWallets] = React.useState<Wallet[]>([]);
	const [delegate, setDelegate] = React.useState<Contracts.WalletData>((null as unknown) as Contracts.WalletData);
	const [delegates, setDelegates] = React.useState<Coins.WalletDataCollection>(
		(null as unknown) as Coins.WalletDataCollection,
	);

	const loadData = async () => {
		const wallets = await generateWallets(profile, setWallets);

		if (withDelegate) {
			setDelegate(await wallets[0].delegate("arkx"));
		}

		if (withDelegates) {
			setDelegates((await wallets[0].delegates()).data);
		}

		setWallets(wallets);
	};

	React.useEffect(() => {
		loadData();
	}, []);

	if (wallets.length === 0) {
		return <>Loading Wallets</>;
	}

	return <>{children({ delegate, delegates, wallets })}</>;
};
