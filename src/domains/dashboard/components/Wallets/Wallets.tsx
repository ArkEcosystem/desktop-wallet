import { ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { chunk } from "@arkecosystem/utils";
import { Button } from "app/components/Button";
import { DropdownOption } from "app/components/Dropdown";
import { Section } from "app/components/Layout";
import { Slider } from "app/components/Slider";
import { Table } from "app/components/Table";
import { WalletCard } from "app/components/WalletCard";
import { WalletListItem } from "app/components/WalletListItem";
import { useActiveProfile } from "app/hooks";
import { WalletsControls } from "domains/dashboard/components/WalletsControls";
import { LedgerWaitingDevice } from "domains/wallet/components/Ledger/LedgerWaitingDevice";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { useWalletFilters } from "../FilterWallets";

type WalletsProps = {
	title?: string;
	viewType?: "grid" | "list";
	wallets?: ReadWriteWallet[];
	walletsEmptyText?: string;
	onCreateWallet?: any;
	onImportWallet?: any;
	onImportLedgerWallet?: () => void;
	onSelectViewType?: any;
	onWalletAction?: any;
};

type GridWallet = {
	isBlank?: boolean;
	wallet?: ReadWriteWallet;
};

export const Wallets = ({
	title,
	walletsEmptyText,
	onCreateWallet,
	onImportWallet,
	onImportLedgerWallet,
	onWalletAction,
}: WalletsProps) => {
	const [allWallets, setAllWallets] = useState<any>(undefined);
	const [isWaitingLedger, setIsWaitingLedger] = useState(false);
	const history = useHistory();

	const { t } = useTranslation();

	const activeProfile = useActiveProfile();
	const filterProperties = useWalletFilters({ profile: activeProfile });
	const { viewType, walletsDisplayType, selectedNetworkIds, showTransactions, update } = filterProperties;

	const walletCardActions: DropdownOption[] = [];

	const wallets = useMemo(() => {
		if (activeProfile.settings().get(ProfileSetting.UseTestNetworks)) return activeProfile.wallets().values();

		return activeProfile
			.wallets()
			.values()
			.filter((wallet) => wallet.network().isLive());
	}, [activeProfile]);

	const [hasMoreWallets, setHasMoreWallets] = useState<any>(wallets.length > 10);

	const listColumns = [
		{
			Header: t("COMMON.WALLET_ADDRESS"),
			accessor: ({ wallet }: { wallet: ReadWriteWallet }) => wallet.alias() || wallet.address(),
			className: "ml-24",
		},
		{
			Header: t("COMMON.WALLET_TYPE"),
			className: "justify-center",
		},
		{
			Header: t("COMMON.BALANCE"),
			accessor: ({ wallet }: { wallet: ReadWriteWallet }) => wallet.balance?.().toFixed(),
			className: "justify-end",
		},
		{
			Header: t("COMMON.FIAT_VALUE"),
			accessor: ({ wallet }: { wallet: ReadWriteWallet }) => wallet.convertedBalance?.().toFixed(),
			className: "justify-end",
		},
	];

	const walletSliderOptions = {
		slideHeight: 192,
		slidesPerView: 3,
		slidesPerColumn: 2,
		slidesPerGroup: 3,
		spaceBetween: 20,
	};

	// Grid
	const loadGridWallets = () => {
		const walletObjects = wallets
			.filter((wallet: ReadWriteWallet) => {
				if (!selectedNetworkIds?.includes(wallet.network().id())) return false;

				if (walletsDisplayType === "favorites") {
					return wallet.isStarred();
				}

				if (walletsDisplayType === "ledger") {
					return wallet.isLedger();
				}

				return wallet;
			})
			.map((wallet: ReadWriteWallet) => ({ wallet, actions: walletCardActions }));

		if (walletObjects.length <= walletSliderOptions.slidesPerView) {
			return walletObjects.concat(
				new Array(walletSliderOptions.slidesPerView - walletObjects.length).fill({ isBlank: true }),
			);
		}

		const walletsPerPage = walletSliderOptions.slidesPerView * 2;
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

	// List
	const getWalletsForList = () =>
		wallets
			.filter((wallet: any) => {
				if (!selectedNetworkIds?.includes(wallet.network().id())) return false;

				if (walletsDisplayType === "favorites") {
					return wallet.isStarred();
				}

				if (walletsDisplayType === "ledger") {
					return wallet.isLedger();
				}

				return wallet && !wallet.isBlank;
			})
			.map((wallet) => ({ wallet }));

	const loadListWallets = () => allWallets || getWalletsForList().slice(0, 10);

	const loadAllListWallets = () => {
		setAllWallets(getWalletsForList());
		setHasMoreWallets(false);
	};

	const handleClick = (walletId: string) => {
		history.push(`/profiles/${activeProfile.id()}/wallets/${walletId}`);
	};

	const onLedgerModalClose = (hasDeviceAvailable: boolean) => {
		setIsWaitingLedger(false);
		if (hasDeviceAvailable) {
			onImportLedgerWallet?.();
		}
	};

	return (
		<Section className={!showTransactions ? "flex-1" : undefined}>
			<div className="flex items-center justify-between mb-8">
				<div className="-mt-1 text-4xl font-bold">{title}</div>
				<div className="text-right">
					<WalletsControls
						filterProperties={filterProperties}
						onCreateWallet={onCreateWallet}
						onImportWallet={onImportWallet}
						onImportLedgerWallet={() => setIsWaitingLedger(true)}
						onSelectGridView={() => update({ viewType: "grid" })}
						onSelectListView={() => update({ viewType: "list" })}
						onFilterChange={update}
					/>
				</div>
			</div>
			<div className="mt-1">
				{viewType === "grid" && (
					<div className="w-full">
						<Slider data={loadGridWallets()} options={walletSliderOptions}>
							{(walletData: any) => (
								<WalletCard {...walletData} onSelect={onWalletAction} className="w-full" />
							)}
						</Slider>
					</div>
				)}
				{viewType === "list" && (
					<div>
						{wallets.length > 0 && (
							<div data-testid="WalletTable">
								<Table columns={listColumns} data={loadListWallets()}>
									{(rowData: any) => <WalletListItem {...rowData} onClick={handleClick} />}
								</Table>

								{hasMoreWallets && (
									<Button
										variant="plain"
										className="w-full mt-10 mb-5"
										data-testid="WalletsList__ViewMore"
										onClick={() => loadAllListWallets()}
									>
										{t("COMMON.VIEW_MORE")}
									</Button>
								)}
							</div>
						)}
						{wallets.length === 0 && <div className="text-theme-secondary-text">{walletsEmptyText}</div>}
					</div>
				)}
			</div>

			{isWaitingLedger && <LedgerWaitingDevice isOpen={true} onClose={onLedgerModalClose} />}
		</Section>
	);
};

Wallets.defaultProps = {
	activeFilter: false,
	networks: [],
	viewType: "grid",
	wallets: [],
	walletsEmptyText: "",
};
