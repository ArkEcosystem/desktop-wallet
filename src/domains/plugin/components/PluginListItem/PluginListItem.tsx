import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { ReviewRating } from "app/components/ReviewRating";
import { TableCell, TableRow } from "app/components/Table";
import { Tooltip } from "app/components/Tooltip";
import React from "react";
import { useTranslation } from "react-i18next";

type PluginListItemProps = {
	onDisable?: (plugin: any) => void;
	onEnable?: (plugin: any) => void;
	onLaunch?: (plugin: any) => void;
	showRating?: boolean;
	onInstall: any;
	plugin: any;
};

export const PluginListItem = ({
	onDisable,
	onInstall,
	onEnable,
	showRating,
	onLaunch,
	plugin,
}: PluginListItemProps) => {
	const { t } = useTranslation();

	return (
		<TableRow>
			<TableCell variant="start" className="w-20">
				<div className="w-15 h-15 flex items-center justify-center">
					{plugin.logo ? (
						<img src={plugin.logo} alt={plugin.name} />
					) : (
						<Avatar address={`${plugin.id}`} rounded={false} className="rounded" noShadow />
					)}
				</div>
			</TableCell>

			<TableCell innerClassName="space-x-2">
				<a href="/" className="font-semibold link">
					{plugin.name}
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

			{showRating && (
				<TableCell>
					<ReviewRating width={3} rating={plugin.rating} />
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
								<div className="mx-auto text-2xl text-theme-success-500">
									<Icon name="StatusOk" />
								</div>
							</Tooltip>
						) : (
							<Tooltip content="Disabled">
								<div className="mx-auto text-2xl text-theme-danger-400">
									<Icon name="StatusFailed" />
								</div>
							</Tooltip>
						)}
					</>
				) : (
					<Tooltip content="Not installed">
						<div className="mx-auto flex items-center justify-center w-6 h-6 text-theme-neutral">
							<Icon name="Dash" />
						</div>
					</Tooltip>
				)}
			</TableCell>

			<TableCell variant="end" className="w-16" innerClassName="justify-end">
				{!plugin.isInstalled && (
					<Button variant="plain" onClick={() => onInstall(plugin)} data-testid="PluginListItem__install">
						{t("COMMON.INSTALL")}
					</Button>
				)}

				{plugin.isInstalled && (
					<div className="flex items-center space-x-2">
						{plugin.hasLaunch && (
							<Button
								variant="plain"
								onClick={() => onLaunch?.(plugin)}
								data-testid="PluginListItem__launch"
							>
								{t("COMMON.LAUNCH")}
							</Button>
						)}
						<Dropdown
							toggleContent={
								<Button variant="plain" size="icon" className="text-left">
									<Icon name="Settings" width={20} height={20} />
								</Button>
							}
							options={[
								{ label: t("COMMON.VIEW"), value: "view" },
								{
									label: plugin.isEnabled ? t("COMMON.DISABLE") : t("COMMON.ENABLE"),
									value: plugin.isEnabled ? "disable" : "enable",
								},
							]}
							onSelect={(option: any) => {
								if (option.value === "disable") {
									return onDisable?.(plugin);
								}

								if (option.value === "enable") {
									return onEnable?.(plugin);
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
