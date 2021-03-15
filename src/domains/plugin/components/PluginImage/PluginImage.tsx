import { CircularProgressBar } from "app/components/CircularProgressBar";
import { Image } from "app/components/Image";
import { useTheme } from "app/hooks";
import cn from "classnames";
import React, { useMemo } from "react";
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

const PluginImageWrapper = styled.div<{ size?: Size; variant?: string }>(getStyles);

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
	const { isDarkMode } = useTheme();

	const { t } = useTranslation();

	const colors = useMemo(
		() => ({
			strokeColor: isDarkMode ? "var(--theme-color-success-800)" : "var(--theme-color-success-200)",
			progressColor: isDarkMode ? "var(--theme-color-success-600)" : "var(--theme-color-success-600)",
		}),
		[isDarkMode],
	);

	if (isUpdating) {
		return (
			<PluginImageWrapper
				size={size}
				className={className}
				variant="progress"
				data-testid="PluginImage__updating"
			>
				<CircularProgressBar
					value={+(updatingProgress! * 100).toFixed(0)}
					size={progressSize}
					strokeWidth={3}
					fontSize={0.8}
					{...colors}
				/>
				{showUpdatingLabel && (
					<p
						data-testid="PluginImage__updating__label"
						className="text-theme-success-600 text-sm font-semibold"
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
			className={cn({ "filter-grayscale": !isEnabled })}
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
