import { Circle, CircleProps } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Tooltip } from "app/components/Tooltip";
import { getNetworkExtendedData } from "domains/network/helpers";
import React from "react";
import { Size } from "types";

type Props = {
	coin?: string;
	network?: string;
	as?: React.ElementType;
	size?: Size;
	className?: string;
	iconSize?: number;
	showTooltip?: boolean;
	noShadow?: boolean;
	shadowColor?: string;
};

const Placeholder = (props: CircleProps) => (
	<Circle
		data-testid="NetworkIcon__placeholder"
		className="border-theme-secondary-200 dark:border-theme-secondary-700 text-theme-secondary-500"
		{...props}
	/>
);

export const NetworkIcon = ({ coin, network, iconSize, className, showTooltip, ...props }: Props) => {
	const networkExtendedData = coin && network ? getNetworkExtendedData({ coin, network }) : undefined;

	if (!networkExtendedData) {
		return <Placeholder {...props} />;
	}

	const { iconName, borderClass, textClass } = networkExtendedData;
	const displayName = networkExtendedData.displayName;

	return (
		<Tooltip content={displayName} disabled={!showTooltip || !displayName}>
			<Circle
				aria-label={displayName}
				data-testid={`NetworkIcon-${coin}-${network}`}
				className={className ? className : `${borderClass} ${textClass}`}
				{...props}
			>
				<Icon data-testid="NetworkIcon__icon" name={iconName} width={iconSize} height={iconSize} />
			</Circle>
		</Tooltip>
	);
};

NetworkIcon.defaultProps = {
	showTooltip: true,
	iconSize: 20,
};
