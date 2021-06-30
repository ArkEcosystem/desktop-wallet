import { Circle, CircleProps } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Tooltip } from "app/components/Tooltip";
import { getNetworkExtendedData } from "domains/network/helpers";
import React from "react";
import { Size } from "types";

interface Properties {
	coin?: string;
	network?: string;
	as?: React.ElementType;
	size?: Size;
	className?: string;
	shadowClassName?: string;
	iconSize?: number;
	showTooltip?: boolean;
	noShadow?: boolean;
}

const Placeholder = (properties: CircleProps) => (
	<Circle
		data-testid="NetworkIcon__placeholder"
		className="border-theme-secondary-200 text-theme-secondary-500 dark:border-theme-secondary-700"
		{...properties}
	/>
);

export const NetworkIcon = ({ coin, network, iconSize, className, showTooltip, ...properties }: Properties) => {
	const networkExtendedData = coin && network ? getNetworkExtendedData(network) : undefined;

	if (!networkExtendedData) {
		return <Placeholder className={className} {...properties} />;
	}

	const { iconName, borderClass, textClass } = networkExtendedData;
	const displayName = networkExtendedData.displayName;

	return (
		<Tooltip content={displayName} disabled={!showTooltip || !displayName}>
			<Circle
				aria-label={displayName}
				data-testid={`NetworkIcon-${coin}-${network}`}
				className={className ? className : `${borderClass} ${textClass}`}
				{...properties}
			>
				<Icon data-testid="NetworkIcon__icon" name={iconName} width={iconSize} height={iconSize} />
			</Circle>
		</Tooltip>
	);
};

NetworkIcon.defaultProps = {
	iconSize: 20,
	showTooltip: true,
};
