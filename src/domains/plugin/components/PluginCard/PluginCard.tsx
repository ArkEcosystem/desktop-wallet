import { Card } from "app/components/Card";
import { DropdownOption } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { Tooltip } from "app/components/Tooltip";
import cn from "classnames";
import React from "react";
import { useTranslation } from "react-i18next";

import { PluginImage } from "../PluginImage";

interface PluginCardProps {
	actions?: DropdownOption[];
	category?: string;
	plugin: any;
	onClick?: () => void;
	onSelect?: (action: any) => void;
	isUpdating?: boolean;
	updatingProgress?: any;
	showCategory?: boolean;
}

export const BlankPluginCard = ({ name, category }: { name?: string; category?: string }) => {
	const { t } = useTranslation();

	return (
		<Card>
			<div className="flex items-center space-x-4">
				<div className="rounded-xl border-2 h-25 w-25 border-theme-primary-100 dark:border-theme-secondary-800" />
				<div className="flex flex-col truncate">
					<span className="text-sm font-semibold text-theme-primary-100 truncate dark:text-theme-secondary-800">
						{t("COMMON.AUTHOR")}
					</span>

					<div className="mt-1 text-lg font-bold text-theme-primary-100 truncate dark:text-theme-secondary-800">
						{name || t("COMMON.NAME")}
					</div>

					{category && (
						<div className="flex items-center mt-4 space-x-2 text-theme-primary-100 dark:text-theme-secondary-800">
							<Icon name="Category" width={20} height={20} />

							<span className="text-sm font-semibold">
								{t(`PLUGINS.CATEGORIES.${category.toUpperCase()}`)}
							</span>
						</div>
					)}
				</div>
			</div>
		</Card>
	);
};

export const PluginCard = ({
	actions,
	category,
	plugin,
	onClick,
	onSelect,
	isUpdating,
	updatingProgress,
	showCategory,
}: PluginCardProps) => {
	const { t } = useTranslation();

	if (plugin === undefined) {
		return <BlankPluginCard category={category} />;
	}

	const handleUpdate = () => {
		/* istanbul ignore else */
		if (!isUpdating) {
			onSelect?.({ value: "update" });
		}
	};

	return (
		<div data-testid={`PluginCard--${plugin.id}`}>
			<Card
				onClick={onClick}
				actions={actions}
				onSelect={onSelect}
				addonIcons={
					<div className="flex items-center space-x-2">
						{plugin.hasUpdateAvailable && (
							<>
								{plugin.isCompatible === false ? (
									<Tooltip
										content={t("PLUGINS.MINIMUM_VERSION_NOT_SATISFIED", {
											minimumVersion: plugin.minimumVersion,
										})}
									>
										<span
											data-testid="PluginCard__minimum-version-warning"
											className="ml-3 text-xl"
										>
											<Icon name="AlertWarning" className="text-theme-warning-500" />
										</span>
									</Tooltip>
								) : (
									<Tooltip content={!isUpdating && t("PLUGINS.NEW_VERSION_AVAILABLE")}>
										<span
											data-testid="PluginCard__update-available"
											role="button"
											tabIndex={0}
											className={cn({ "cursor-not-allowed": isUpdating })}
											onKeyDown={(event: any) => {
												if (event.key === " " || event.key === "Enter") {
													event.preventDefault();
													event.stopPropagation();
													handleUpdate();
												}
											}}
											onClick={(event: any) => {
												event.stopPropagation();
												handleUpdate();
											}}
										>
											<Icon
												className={cn({ "animate-spin": isUpdating })}
												name="Update"
												width={20}
												height={20}
											/>
										</span>
									</Tooltip>
								)}
							</>
						)}
					</div>
				}
			>
				<div className="flex items-center space-x-4">
					<div className="overflow-hidden flex-shrink-0 rounded-lg w-25 h-25">
						<PluginImage
							logoURL={plugin.logo}
							isUpdating={isUpdating}
							updatingProgress={updatingProgress}
						/>
					</div>

					<div className="flex flex-col truncate">
						<span className="text-sm font-semibold truncate text-theme-secondary-500 dark:text-theme-secondary-700">
							{plugin.author}
						</span>

						<div className="flex items-center mt-1 space-x-2 text-lg font-bold truncate text-theme-primary-600 dark:text-theme-secondary-200">
							<div className="truncate">{plugin.title}</div>

							<span>
								{plugin.isOfficial && <Icon name="OfficialArkPlugin" width={16} height={16} />}
								{plugin.isGrant && <Icon name="Grant" width={20} height={20} />}
							</span>
						</div>

						{showCategory && (
							<div className="flex items-center mt-4 space-x-2 dark:text-theme-secondary-600">
								<Icon name="Category" width={20} height={20} />

								<span className="text-sm font-semibold">
									{t(`PLUGINS.CATEGORIES.${plugin.category.toUpperCase()}`)}
								</span>
							</div>
						)}
					</div>
				</div>
			</Card>
		</div>
	);
};

PluginCard.defaultProps = {
	showCategory: true,
};
