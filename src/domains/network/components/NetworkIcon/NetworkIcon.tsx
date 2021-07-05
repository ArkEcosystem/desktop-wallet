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

	const { iconName, displayName, isLive } = networkExtendedData;

	const getClassName = () => {
		if (className) {
			return className;
		}

		if (isLive) {
			return "text-theme-primary-600 border-theme-primary-100 dark:border-theme-primary-600";
		}

		return "text-theme-secondary-700 border-theme-secondary-300 dark:border-theme-secondary-700";
	};

	return (
		<Tooltip content={displayName} disabled={!showTooltip || !displayName}>
			<Circle
				aria-label={displayName}
				data-testid={`NetworkIcon-${coin}-${network}`}
				className={getClassName()}
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
