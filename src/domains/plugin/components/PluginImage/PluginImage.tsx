import { CircularProgressBar } from "app/components/CircularProgressBar";
import { Image } from "app/components/Image";
import cs from "classnames";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
	logoURL?: string;
	isUpdating?: boolean;
	updatingProgress?: number;
	progressSize?: number;
	showUpdatingLabel?: boolean;
} & React.HTMLProps<any>;

export const PluginImage = ({
	logoURL,
	isUpdating,
	updatingProgress,
	progressSize,
	className,
	showUpdatingLabel,
}: Props) => {
	const { t } = useTranslation();

	if (isUpdating) {
		return (
			<div
				data-testid="PluginImage__updating"
				className={cs(
					"rounded-lg overflow-hidden bg-theme-success-100 flex flex-col space-y-3 items-center justify-center border border-theme-secondary-300 dark:border-theme-secondary-600",
					className,
				)}
			>
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
			</div>
		);
	}

	if (!logoURL) {
		return (
			<div data-testid="PluginImage__placeholder">
				<Image name="PluginLogoPlaceholder" domain="plugin" className={className} />
			</div>
		);
	}

	return (
		<img
			data-testid="PluginImage__logo"
			src={logoURL}
			alt="Logo"
			className={cs("overflow-hidden rounded-lg", className)}
		/>
	);
};

PluginImage.defaultProps = {
	progressSize: 40,
	updatingProgress: 0,
};
