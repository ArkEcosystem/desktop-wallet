import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { chunk } from "@arkecosystem/utils";
import { Button } from "app/components/Button";
import { Slider } from "app/components/Slider";
import { Table } from "app/components/Table";
import { WalletCard } from "app/components/WalletCard";
import { WalletListItem } from "app/components/WalletListItem";
import { useActiveProfile } from "app/hooks/env";
import { WalletsControls } from "domains/dashboard/components/WalletsControls";
import { LedgerWaitingDevice } from "domains/wallet/components/Ledger/LedgerWaitingDevice";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

type WalletsProps = {
	wallets: ReadWriteWallet[];
	title?: string;
	walletsEmptyText?: string;
	filterProperties: any;
	viewType?: "grid" | "list";
	onCreateWallet?: any;
	onImportWallet?: any;
	onImportLedgerWallet?: () => void;
	onWalletAction?: any;
};

type GridWallet = {
	wallet?: ReadWriteWallet;
	isBlank?: boolean;
};

export const Wallets = ({
	viewType,
	title,
	wallets,
	filterProperties,
	onCreateWallet,
	onImportWallet,
	onImportLedgerWallet,
	onWalletAction,
	walletsEmptyText,
}: WalletsProps) => {
	const [walletsViewType, setWalletsViewType] = useState(viewType);
	const [allWallets, setAllWallets] = useState<any>(undefined);
	const [hasMoreWallets, setHasMoreWallets] = useState<any>(wallets.length > 10);
	const [isWaitingLedger, setIsWaitingLedger] = useState(false);

	const activeProfile = useActiveProfile();

	const history = useHistory();

	const { t } = useTranslation();

	const listColumns = [
		{
			Header: t("COMMON.ASSET_TYPE"),
			accessor: "avatarId",
		},
		{
			Header: t("COMMON.WALLET_ADDRESS"),
			accessor: "address",
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
		slideHeight: 185,
		slidesPerView: 3,
		slidesPerColumn: 2,
		slidesPerGroup: 3,
		spaceBetween: 20,
	};

	// Grid
	const loadGridWallets = () => {
		const walletObjects = wallets.map((wallet: ReadWriteWallet) => ({ wallet }));

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
	const getWalletsForList = () => wallets.filter((wallet: any) => !wallet.isBlank).map((wallet) => ({ wallet }));

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
		<div>
			<div className="flex items-center justify-between pb-8">
				<div className="-mt-1 text-4xl font-bold">{title}</div>
				<div className="text-right">
					<WalletsControls
						onCreateWallet={onCreateWallet}
						onImportWallet={onImportWallet}
						onImportLedgerWallet={() => setIsWaitingLedger(true)}
						onSelectGridView={() => setWalletsViewType("grid")}
						onSelectListView={() => setWalletsViewType("list")}
						filterProperties={filterProperties}
						viewType={walletsViewType}
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
						{wallets.length === 0 && <div className="text-theme-neutral-dark">{walletsEmptyText}</div>}
					</div>
				)}
			</div>

			{isWaitingLedger && <LedgerWaitingDevice isOpen={true} onClose={onLedgerModalClose} />}
		</div>
	);
};

Wallets.defaultProps = {
	networks: [],
	wallets: [],
	walletsEmptyText: "",
	viewType: "grid",
};
