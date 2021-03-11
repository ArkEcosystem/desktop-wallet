import { Badge } from "app/components/Badge";
import { Button } from "app/components/Button";
import { Dropdown, DropdownOption } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { TableCell, TableRow } from "app/components/Table";
import { Tooltip } from "app/components/Tooltip";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { PluginImage } from "../PluginImage";

type PluginListItemProps = {
	onDelete?: (plugin: any) => void;
	onInstall: any;
	onLaunch?: (plugin: any) => void;
	onEnable?: (plugin: any) => void;
	onDisable?: (plugin: any) => void;
	onUpdate?: (plugin: any) => void;
	onClick?: (plugin: any) => void;
	isUpdating?: boolean;
	updatingProgress?: any;
	plugin: any;
	showCategory?: boolean;
};

export const PluginListItem = ({
	onDelete,
	onInstall,
	onEnable,
	onDisable,
	onLaunch,
	onUpdate,
	onClick,
	isUpdating,
	updatingProgress,
	plugin,
	showCategory,
}: PluginListItemProps) => {
	const { t } = useTranslation();

	const handleInstall = () => {
		onInstall?.(plugin);
	};

	const actions = useMemo(() => {
		const result: DropdownOption[] = [];

		if (plugin.hasUpdateAvailable) {
			result.push({ label: t("COMMON.UPDATE"), value: "update" });
		}

		if (plugin.isEnabled) {
			result.push({ label: t("COMMON.DISABLE"), value: "disable" });
		} else {
			result.push({ label: t("COMMON.ENABLE"), value: "enable" });
		}

		result.push({ label: t("COMMON.DELETE"), value: "delete" });

		return result;
	}, [t, plugin]);

	return (
		<TableRow>
			<TableCell variant="start" innerClassName="space-x-5">
				<PluginImage
					size="sm"
					logoURL={plugin.logo}
					isUpdating={isUpdating}
					updatingProgress={updatingProgress}
				/>

				<div className="flex items-center space-x-2 text-left">
					<span
						data-testid="PluginListItem__link"
						onClick={() => onClick?.(plugin)}
						className="font-semibold link flex items-center space-x-2"
					>
						{plugin.title}
					</span>

					{plugin.isOfficial && <Icon name="OfficialArkPlugin" width={18} height={18} />}
					{plugin.isGrant && <Icon name="Grant" width={14} height={20} />}

					{plugin.hasUpdateAvailable && plugin.isMinimumVersionSatisfied === false && (
						<Tooltip
							content={t("PLUGINS.MINIMUM_VERSION_NOT_SATISFIED", {
								minimumVersion: plugin.minimumVersion,
							})}
						>
							<span data-testid="PluginListItem__minimum-version-warning" className="ml-3 text-xl">
								<Icon name="AlertWarning" className="text-theme-warning-500" />
							</span>
						</Tooltip>
					)}
				</div>
			</TableCell>

			<TableCell>
				<span>{plugin.author}</span>
			</TableCell>

			{showCategory && (
				<TableCell>
					<span>{t(`PLUGINS.CATEGORIES.${plugin.category.toUpperCase()}`)}</span>
				</TableCell>
			)}

			<TableCell>
				<span>v{plugin.version}</span>
			</TableCell>

			<TableCell>
				<span>{plugin.size}</span>
			</TableCell>

			<TableCell>
				{plugin.isInstalled ? (
					<>
						{plugin.isEnabled ? (
							<Tooltip content="Enabled">
								<div
									data-testid="PluginListItem__enabled"
									className="mx-auto text-2xl text-theme-success-500"
								>
									<Icon name="StatusOk" />
								</div>
							</Tooltip>
						) : (
							<Tooltip content="Disabled">
								<div
									data-testid="PluginListItem__disabled"
									className="mx-auto text-2xl text-theme-danger-400"
								>
									<Icon name="StatusFailed" />
								</div>
							</Tooltip>
						)}
					</>
				) : (
					<Tooltip content="Not installed">
						<div
							data-testid="PluginListItem__not-installed"
							className="flex justify-center items-center mx-auto w-6 h-6 text-theme-secondary-500"
						>
							<Icon name="Dash" />
						</div>
					</Tooltip>
				)}
			</TableCell>

			<TableCell variant="end" className="w-16" innerClassName="justify-end">
				{!plugin.isInstalled && (
					<Button
						variant="secondary"
						onClick={handleInstall}
						data-testid="PluginListItem__install"
						className="flex-1"
					>
						{t("COMMON.INSTALL")}
					</Button>
				)}

				{plugin.isInstalled && (
					<div className="flex items-center space-x-2">
						{plugin.hasLaunch && (
							<Button
								variant="secondary"
								onClick={() => onLaunch?.(plugin)}
								data-testid="PluginListItem__launch"
							>
								{t("COMMON.LAUNCH")}
							</Button>
						)}
						<Dropdown
							toggleContent={
								<div className="relative">
									{plugin.hasUpdateAvailable && (
										<Tooltip content={t("PLUGINS.NEW_VERSION_AVAILABLE")}>
											<Badge
												data-testid="PluginListItem__update-badge"
												size="sm"
												className="bg-theme-danger-500"
												position="top-right"
											/>
										</Tooltip>
									)}
									<Button variant="secondary" size="icon" className="text-left">
										<Icon name="Settings" width={20} height={20} />
									</Button>
								</div>
							}
							options={actions}
							onSelect={(option: any) => {
								if (option.value === "delete") {
									onDelete?.(plugin);
								}

								if (option.value === "enable") {
									return onEnable?.(plugin);
								}

								if (option.value === "disable") {
									return onDisable?.(plugin);
								}

								if (option.value === "update") {
									return onUpdate?.(plugin);
								}
							}}
							dropdownClass="top-3 text-left"
						/>
					</div>
				)}
			</TableCell>
		</TableRow>
	);
};

PluginListItem.defaultProps = {
	updatingProgress: 0,
};
