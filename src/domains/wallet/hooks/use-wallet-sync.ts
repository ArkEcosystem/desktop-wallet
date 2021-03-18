import { Environment, Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";

type WalletImportTypes = {
	profile: Profile;
	env: Environment;
};

export const useWalletSync = ({ profile, env }: WalletImportTypes) => {
	const syncFees = async (wallet: ReadWriteWallet) => {
		const network = wallet.network();
		try {
			env.fees().all(network.coin(), network.id());
		} catch {
			// Sync network fees for the first time
			await env.fees().sync(network.coin(), network.id());
		}
	};

	const syncRates = (profile: Profile, wallet: ReadWriteWallet) =>
		env.exchangeRates().syncAll(profile, wallet.currency());

	const syncVotes = async (wallet: ReadWriteWallet) => {
		const network = wallet.network();

		if (network.allowsVoting()) {
			try {
				env.delegates().all(network.coin(), network.id());
			} catch {
				// Sync network delegates for the first time
				await env.delegates().sync(network.coin(), network.id());
			}
			await wallet.syncVotes();
		}
	};

	const syncAll = async (wallet: ReadWriteWallet) =>
		Promise.allSettled([syncVotes(wallet), syncRates(profile, wallet), syncFees(wallet)]);

	return { syncAll };
};
