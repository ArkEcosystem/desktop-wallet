import { Slider } from "app/components/Slider";
import { WalletCard } from "app/components/WalletCard";
import React, { memo } from "react";

import { WalletGridProps } from "./";

export const WalletsGrid = memo(({ isVisible, wallets = [], sliderOptions, onWalletAction }: WalletGridProps) => {
	if (!isVisible) return <></>;

	return (
		<div data-testid="WalletsGrid" className="w-full">
			<Slider data={wallets} options={sliderOptions}>
				{(walletData: any) => <WalletCard {...walletData} onSelect={onWalletAction} className="w-full" />}
			</Slider>
		</div>
	);
});

WalletsGrid.displayName = "WalletsGrid";
