import { Coins } from "@arkecosystem/platform-sdk";
import { Icon } from "app/components/Icon";
import { Tooltip } from "app/components/Tooltip";
import { CoinNetworkExtended } from "domains/network/data";
import React, { memo } from "react";

type Network = Coins.Network & { extra?: CoinNetworkExtended };

type Props = {
	network?: Network;
	as?: React.ElementType;
	className?: string;
	iconClassName?: string;
	iconSize?: number;
	shadowColor?: string;
	onClick?: () => void;
};

export const NetworkOption = memo(({ network, iconSize = 30, iconClassName, onClick, ...props }: Props) => {
	if (!network?.extra) {
		return <></>;
	}

	const iconColorClass = network.isLive() ? "text-theme-secondary-700" : "text-theme-primary-300";

	return (
		<li
			className="inline-block cursor-pointer h-21"
			data-testid="SelectNetwork__NetworkIcon--container"
			onClick={onClick}
		>
			<Tooltip content={network.extra.displayName}>
				<div
					className={`w-full h-full flex justify-center items-center border-2 rounded-xl ${
						iconClassName || `border-theme-primary-100 dark:border-theme-secondary-800 ${iconColorClass}`
					}`}
					aria-label={network.extra.displayName}
					data-testid={`NetworkIcon-${network?.coin()}-${network?.id()}`}
					{...props}
				>
					<Icon
						data-testid="NetworkIcon__icon"
						name={network.extra.iconName}
						width={iconSize}
						height={iconSize}
					/>
				</div>
			</Tooltip>
		</li>
	);
});

NetworkOption.displayName = "NetworkOption";
