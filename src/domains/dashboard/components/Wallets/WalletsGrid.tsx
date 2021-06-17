import { Slider } from "app/components/Slider";
import { WalletCard } from "app/components/WalletCard";
import React, { memo } from "react";

import { WalletGridProperties } from ".";

export const WalletsGrid = memo(
	({ isVisible, isLoading, wallets, sliderOptions, onWalletAction }: WalletGridProperties) => {
		if (!isVisible) {
			return <></>;
		}

		const skeletonSlides = Array.from({ length: 3 }).fill({});
		const data = isLoading ? skeletonSlides : wallets;

		return (
			<div data-testid="WalletsGrid" className="w-full">
				<Slider data={data} options={sliderOptions}>
					{(walletData: any) => (
						<WalletCard
							{...walletData}
							isLoading={isLoading}
							onSelect={onWalletAction}
							className="w-full"
						/>
					)}
				</Slider>
			</div>
		);
	},
);

WalletsGrid.displayName = "WalletsGrid";
