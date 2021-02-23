import { Button } from "app/components/Button";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { Image } from "app/components/Image";
import { TableCell, TableRow } from "app/components/Table";
import { Tooltip } from "app/components/Tooltip";
import React from "react";
import { useTranslation } from "react-i18next";

type PluginListItemProps = {
	onDelete: any;
	onInstall: any;
	onLaunch?: (plugin: any) => void;
	onEnable?: (plugin: any) => void;
	onDisable?: (plugin: any) => void;
	plugin: any;
};

export const PluginListItem = ({ onDelete, onInstall, onEnable, onDisable, onLaunch, plugin }: PluginListItemProps) => {
	const { t } = useTranslation();

	const handleInstall = () => {
		onInstall?.(plugin);
	};

	return (
		<TableRow>
			<TableCell variant="start" innerClassName="space-x-5">
				<div className="flex w-15 h-15 justify-center items-center overflow-hidden rounded-lg">
					{plugin.logo ? (
						<img data-testid="PluginListItem__logo" src={plugin.logo} alt="Logo" className="" />
					) : (
						<Image name="PluginLogoPlaceholder" domain="plugin" className="w-14 h-14" />
					)}
				</div>

				<a href="/" className="font-semibold link">
					{plugin.title}
				</a>

				{plugin.isOfficial && <Icon name="OfficialArkPlugin" width={18} height={18} />}
				{plugin.isGrant && <Icon name="Grant" width={14} height={20} />}
			</TableCell>

			<TableCell innerClassName="pr-16">
				<span>{plugin.author}</span>
			</TableCell>

			<TableCell>
				<span>{t(`PLUGINS.CATEGORIES.${plugin.category.toUpperCase()}`)}</span>
			</TableCell>

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
					<Button variant="secondary" onClick={handleInstall} data-testid="PluginListItem__install">
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
								<Button variant="secondary" size="icon" className="text-left">
									<Icon name="Settings" width={20} height={20} />
								</Button>
							}
							options={[
								{ label: t("COMMON.DELETE"), value: "delete" },
								{
									label: plugin.isEnabled ? t("COMMON.DISABLE") : t("COMMON.ENABLE"),
									value: plugin.isEnabled ? "disable" : "enable",
								},
							]}
							onSelect={(option: any) => {
								if (option.value === "delete") {
									onDelete(plugin);
								}

								if (option.value === "enable") {
									return onEnable?.(plugin);
								}

								if (option.value === "disable") {
									return onDisable?.(plugin);
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
