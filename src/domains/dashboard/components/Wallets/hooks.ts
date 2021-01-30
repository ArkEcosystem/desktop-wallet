import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { chunk } from "@arkecosystem/utils";
import { useMemo } from "react";

import { GridWallet, UseWalletDisplayProps } from "./";

export const useWalletDisplay = ({
	wallets = [],
	selectedNetworkIds,
	displayType = "all",
	viewMore = false,
	listPagerLimit = 10,
}: UseWalletDisplayProps) => {
	const sliderOptions = {
		slideHeight: 192,
		slidesPerView: 3,
		slidesPerColumn: 2,
		slidesPerGroup: 3,
		spaceBetween: 20,
	};

	const { listWallets, gridWallets, listHasMore } = useMemo(() => {
		const listWallets = wallets
			.filter((wallet: any) => {
				if (displayType === "favorites") {
					return wallet.isStarred();
				}
				if (displayType === "ledger") {
					return wallet.isLedger();
				}
				return wallet && !wallet.isBlank && selectedNetworkIds?.includes(wallet.network().id());
			})
			.map((wallet) => ({ wallet }));

		const loadGridWallets = () => {
			const walletObjects = wallets
				.filter((wallet: ReadWriteWallet) => {
					if (!selectedNetworkIds?.includes(wallet.network().id())) {
						return false;
					}

					if (displayType === "favorites") {
						return wallet.isStarred();
					}

					if (displayType === "ledger") {
						return wallet.isLedger();
					}

					return wallet;
				})
				.map((wallet: ReadWriteWallet) => ({ wallet }));

			if (walletObjects.length <= sliderOptions.slidesPerView) {
				return walletObjects.concat(
					new Array(sliderOptions.slidesPerView - walletObjects.length).fill({ isBlank: true }),
				);
			}

			const walletsPerPage = sliderOptions.slidesPerView * 2;
			const desiredLength = Math.ceil(walletObjects.length / walletsPerPage) * walletsPerPage;

			walletObjects.push(...new Array(desiredLength - walletObjects.length).fill({ isBlank: true }));

			const result: GridWallet[] = [];

			for (const page of chunk(walletObjects, walletsPerPage)) {
				const firstHalf = page.slice(0, walletsPerPage / 2);
				const secondHalf = page.slice(walletsPerPage / 2, page.length);

				for (let i = 0; i < firstHalf.length; i++) {
					result.push(firstHalf[i], secondHalf[i]);
				}
			}

			return result;
		};

		return {
			listWallets: viewMore ? listWallets : listWallets.slice(0, listPagerLimit),
			gridWallets: loadGridWallets(),
			listHasMore: wallets.length > 0 && listWallets.length > listPagerLimit && !viewMore,
		};
	}, [wallets, selectedNetworkIds, displayType, viewMore, sliderOptions.slidesPerView, listPagerLimit]);

	return { listWallets, gridWallets, sliderOptions, listHasMore };
};
