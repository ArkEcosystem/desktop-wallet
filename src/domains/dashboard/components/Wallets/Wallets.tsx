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
};

export const Wallets = ({
	title,
	onCreateWallet,
	onImportWallet,
	onImportLedgerWallet,
	onWalletAction,
}: WalletsProps) => {
	const [viewMore, setViewMore] = useState(false);
	const [isWaitingLedger, setIsWaitingLedger] = useState(false);

	const history = useHistory();
	const activeProfile = useActiveProfile();

	const filterProperties = useWalletFilters({ profile: activeProfile });
	const { viewType, walletsDisplayType, selectedNetworkIds, showTransactions, update } = filterProperties;

	const wallets = useMemo(() => {
		if (activeProfile.settings().get(ProfileSetting.UseTestNetworks)) return activeProfile.wallets().values();

		return activeProfile
			.wallets()
			.values()
			.filter((wallet) => wallet.network().isLive());
	}, [activeProfile]);

	const { listWallets, listHasMore, gridWallets, sliderOptions } = useWalletDisplay({
		wallets,
		selectedNetworkIds,
		displayType: walletsDisplayType,
		viewMore,
	});

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
				<WalletsGrid
					isVisible={viewType === "grid"}
					wallets={gridWallets}
					sliderOptions={sliderOptions}
					onWalletAction={onWalletAction}
				/>

				<WalletsList
					isVisible={viewType === "list"}
					wallets={listWallets}
					hasMore={listHasMore}
					onRowClick={handleClick}
					onViewMore={() => setViewMore(true)}
				 />
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
