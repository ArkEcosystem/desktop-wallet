import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { chunk } from "@arkecosystem/utils";
import { DropdownOption } from "app/components/Dropdown";
import { useMemo } from "react";

import { GridWallet, UseWalletDisplayProps } from "./";

export const useWalletDisplay = ({
	wallets = [],
	selectedNetworkIds,
	displayType = "all",
	viewMore,
}: UseWalletDisplayProps) => {
	const sliderOptions = {
		slideHeight: 192,
		slidesPerView: 3,
		slidesPerColumn: 2,
		slidesPerGroup: 3,
		spaceBetween: 20,
	};

	const { listWallets, gridWallets, listHasMore } = useMemo(() => {
		const walletCardActions: DropdownOption[] = [];
		const listPagerLimit = 10;

		const listWallets = wallets
			.filter((wallet: any, index: number) => {
				if (!viewMore && index > listPagerLimit) return false;

				if (!selectedNetworkIds?.includes(wallet.network().id())) return false;

				if (displayType === "favorites") {
					return wallet.isStarred();
				}

				if (displayType === "ledger") {
					return wallet.isLedger();
				}

				return wallet && !wallet.isBlank;
			})
			.map((wallet) => ({ wallet }));

		const loadGridWallets = () => {
			const walletObjects = wallets
				.filter((wallet: ReadWriteWallet) => {
					if (!selectedNetworkIds?.includes(wallet.network().id())) return false;

					if (displayType === "favorites") {
						return wallet.isStarred();
					}

					if (displayType === "ledger") {
						return wallet.isLedger();
					}

					return wallet;
				})
				.map((wallet: ReadWriteWallet) => ({ wallet, actions: walletCardActions }));

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
			listWallets,
			gridWallets: loadGridWallets(),
			listHasMore: wallets.length > 0 && wallets.length > listWallets.length,
		};
	}, [wallets, selectedNetworkIds, displayType, viewMore, sliderOptions.slidesPerView]);

	return { listWallets, gridWallets, sliderOptions, listHasMore };
};
