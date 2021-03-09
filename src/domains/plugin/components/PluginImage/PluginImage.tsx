import { CircularProgressBar } from "app/components/CircularProgressBar";
import { Image } from "app/components/Image";
import cn from "classnames";
import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "twin.macro";
import { Size } from "types";

import { getStyles } from "./PluginImage.styles";

type Props = {
	size?: Size;
	logoURL?: string;
	isEnabled?: boolean;
	isUpdating?: boolean;
	updatingProgress?: number;
	progressSize?: number;
	className?: string;
	showUpdatingLabel?: boolean;
};

const PluginImageWrapper = styled.div<Props>(getStyles);

export const PluginImage = ({
	size,
	logoURL,
	isEnabled,
	isUpdating,
	updatingProgress,
	progressSize,
	className,
	showUpdatingLabel,
}: Props) => {
	const { t } = useTranslation();

	if (isUpdating) {
		return (
			<PluginImageWrapper size={size} className={className} data-testid="PluginImage__updating">
				<CircularProgressBar
					value={+(updatingProgress! * 100).toFixed(0)}
					size={progressSize}
					strokeWidth={2}
					fontSize={0.8}
				/>
				{showUpdatingLabel && (
					<p
						data-testid="PluginImage__updating__label"
						className="text-theme-secondary-600 dark:text-theme-secondary-text text-sm font-medium"
					>
						{t("COMMON.UPDATING")}
					</p>
				)}
			</PluginImageWrapper>
		);
	}

	if (!logoURL) {
		return (
			<PluginImageWrapper
				size={size}
				className={cn(className, { "filter-grayscale": !isEnabled })}
				data-testid="PluginImage__placeholder"
			>
				<Image name="PluginLogoPlaceholder" domain="plugin" />
			</PluginImageWrapper>
		);
	}

	return (
		<PluginImageWrapper
			size={size}
			className={cn({ "filter-grayscale": !isEnabled }, className)}
			data-testid="PluginImage__logo"
		>
			<img src={logoURL} alt="Logo" className="object-cover w-full h-full" />
		</PluginImageWrapper>
	);
};

PluginImage.defaultProps = {
	isEnabled: true,
	progressSize: 40,
	updatingProgress: 0,
};
