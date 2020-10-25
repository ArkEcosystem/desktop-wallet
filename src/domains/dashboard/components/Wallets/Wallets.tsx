import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { chunk } from "@arkecosystem/utils";
import { Button } from "app/components/Button";
import { DropdownOption } from "app/components/Dropdown";
import { Slider } from "app/components/Slider";
import { Table } from "app/components/Table";
import { WalletCard } from "app/components/WalletCard";
import { WalletListItem } from "app/components/WalletListItem";
import { useActiveProfile } from "app/hooks";
import { WalletsControls } from "domains/dashboard/components/WalletsControls";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

type WalletsProps = {
	title?: string;
	filterProperties: any;
	viewType?: "grid" | "list";
	wallets: ReadWriteWallet[];
	walletsEmptyText?: string;
	onCreateWallet?: any;
	onImportWallet?: any;
	onSelectViewType?: any;
	onWalletAction?: any;
};

type GridWallet = {
	isBlank?: boolean;
	wallet?: ReadWriteWallet;
};

export const Wallets = ({
	title,
	filterProperties,
	viewType,
	wallets,
	walletsEmptyText,
	onCreateWallet,
	onImportWallet,
	onSelectViewType,
	onWalletAction,
}: WalletsProps) => {
	const [walletsViewType, setWalletsViewType] = useState(viewType);
	const [allWallets, setAllWallets] = useState<any>(undefined);
	const [hasMoreWallets, setHasMoreWallets] = useState<any>(wallets.length > 10);

	const activeProfile = useActiveProfile();

	const history = useHistory();

	const { t } = useTranslation();

	const { walletsDisplayType } = filterProperties;

	// const walletCardActions: DropdownOption[] = [{ label: t("COMMON.SHOW"), value: "show" }];
	const walletCardActions: DropdownOption[] = [];

	const listColumns = [
		{
			Header: t("COMMON.WALLET_ADDRESS"),
			accessor: "address",
			className: "ml-24",
		},
		{
			Header: t("COMMON.WALLET_TYPE"),
			className: "justify-center",
		},
		{
			Header: t("COMMON.BALANCE"),
			accessor: "balance",
			className: "justify-end",
		},
		{
			Header: t("COMMON.FIAT_VALUE"),
			accessor: "fiat",
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

	const toggleViewType = (viewType: "grid" | "list") => {
		setWalletsViewType(viewType);
		onSelectViewType?.(viewType);
	};

	// Grid
	const loadGridWallets = () => {
		const walletObjects = wallets
			.filter((wallet: ReadWriteWallet) => {
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

	return (
		<div>
			<div className="flex items-center justify-between mb-8">
				<div className="-mt-1 text-4xl font-bold">{title}</div>
				<div className="text-right">
					<WalletsControls
						filterProperties={filterProperties}
						viewType={walletsViewType}
						onCreateWallet={onCreateWallet}
						onImportWallet={onImportWallet}
						onSelectGridView={() => toggleViewType("grid")}
						onSelectListView={() => toggleViewType("list")}
					/>
				</div>
			</div>
			<div className="mt-1">
				{walletsViewType === "grid" && (
					<div className="w-full">
						<Slider data={loadGridWallets()} options={walletSliderOptions}>
							{(walletData: any) => (
								<WalletCard {...walletData} onSelect={onWalletAction} className="w-full" />
							)}
						</Slider>
					</div>
				)}
				{walletsViewType === "list" && (
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
		</div>
	);
};

Wallets.defaultProps = {
	networks: [],
	viewType: "grid",
	wallets: [],
	walletsEmptyText: "",
};
