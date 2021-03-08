import { ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Section } from "app/components/Layout";
import { useActiveProfile } from "app/hooks";
import { useWalletFilters } from "domains/dashboard/components/FilterWallets";
import { WalletsControls } from "domains/dashboard/components/WalletsControls";
import { LedgerWaitingDevice } from "domains/wallet/components/Ledger/LedgerWaitingDevice";
import React, { useMemo, useState } from "react";
import { useHistory } from "react-router-dom";

import { useWalletDisplay, WalletsGrid, WalletsList } from "./";

type WalletsProps = {
	title?: string;
	viewType?: "grid" | "list";
	wallets?: ReadWriteWallet[];
	onCreateWallet?: any;
	onImportWallet?: any;
	onImportLedgerWallet?: () => void;
	onSelectViewType?: any;
	onWalletAction?: any;
	listPagerLimit?: number;
	walletsCount?: number;
	isLoading?: boolean;
};

export const Wallets = ({
	title,
	onCreateWallet,
	onImportWallet,
	onImportLedgerWallet,
	onWalletAction,
	walletsCount,
	listPagerLimit = 10,
	isLoading,
}: WalletsProps) => {
	const [viewMore, setViewMore] = useState(false);
	const [isWaitingLedger, setIsWaitingLedger] = useState(false);

	const history = useHistory();
	const activeProfile = useActiveProfile();

	const filterProperties = useWalletFilters({ profile: activeProfile });
	const { viewType, walletsDisplayType, selectedNetworkIds, update } = filterProperties;

	const wallets = useMemo(() => {
		if (activeProfile.settings().get(ProfileSetting.UseTestNetworks)) {
			return activeProfile.wallets().values();
		}

		return activeProfile
			.wallets()
			.values()
			.filter((wallet) => wallet.network().isLive());
	}, [activeProfile, walletsCount]); // eslint-disable-line react-hooks/exhaustive-deps

	const { listWallets, listHasMore, gridWallets, sliderOptions } = useWalletDisplay({
		wallets,
		selectedNetworkIds,
		displayType: walletsDisplayType,
		viewMore,
		listPagerLimit,
	});

	const handleClick = (walletId: string) => {
		history.push(`/profiles/${activeProfile.id()}/wallets/${walletId}`);
	};

	const handleDeviceAvailable = () => {
		setIsWaitingLedger(false);
		onImportLedgerWallet?.();
	};

	return (
		<Section>
			<div className="flex justify-between items-center mb-8">
				<div className="text-4xl font-bold">{title}</div>

				<div className="text-right">
					<WalletsControls
						filterProperties={filterProperties}
						onCreateWallet={onCreateWallet}
						onImportWallet={onImportWallet}
						onImportLedgerWallet={() => setIsWaitingLedger(true)}
						onSelectGridView={() => update("viewType", "grid")}
						onSelectListView={() => update("viewType", "list")}
						onFilterChange={update}
					/>
				</div>
			</div>

			<WalletsGrid
				isVisible={viewType === "grid"}
				isLoading={isLoading && walletsCount === 0}
				wallets={gridWallets}
				sliderOptions={sliderOptions}
				onWalletAction={onWalletAction}
			/>

			<WalletsList
				isLoading={isLoading && walletsCount === 0}
				isVisible={viewType === "list"}
				wallets={listWallets}
				hasMore={listHasMore}
				onRowClick={handleClick}
				onViewMore={() => setViewMore(true)}
			/>

			{isWaitingLedger && (
				<LedgerWaitingDevice
					isOpen={true}
					onDeviceAvailable={handleDeviceAvailable}
					onClose={() => setIsWaitingLedger(false)}
				/>
			)}
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
