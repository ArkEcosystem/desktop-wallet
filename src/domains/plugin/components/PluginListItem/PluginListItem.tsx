import { Button } from "app/components/Button";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { Image } from "app/components/Image";
import { ReviewRating } from "app/components/ReviewRating";
import { TableCell, TableRow } from "app/components/Table";
import React from "react";
import { useTranslation } from "react-i18next";

type PluginListItemProps = {
	onDelete: any;
	onInstall: any;
	plugin: any;
};

export const PluginListItem = ({ onDelete, onInstall, plugin }: PluginListItemProps) => {
	const { t } = useTranslation();

	return (
		<TableRow>
			<TableCell variant="start" className="w-20">
				<Image name="ChangeNowLogo" domain="exchange" className="w-15 h-15" />
			</TableCell>

			<TableCell innerClassName="space-x-2">
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
				<ReviewRating width={3} rating={plugin.rating} />
			</TableCell>

			<TableCell>
				<span>v {plugin.version}</span>
			</TableCell>

			<TableCell>
				<span>{plugin.size}</span>
			</TableCell>

			<TableCell>
				{plugin.isInstalled ? (
					<div className="flex mx-auto w-6 h-6 rounded-full border-2 border-theme-success-200 text-theme-success-500">
						<div className="m-auto">
							<Icon name="Checkmark" width={15} height={15} />
						</div>
					</div>
				) : (
					<div className="flex mx-auto w-6 h-6">
						<div className="m-auto text-theme-secondary-500">
							<Icon name="Dash" width={15} height={15} />
						</div>
					</div>
				)}
			</TableCell>

			<TableCell variant="end" className="w-16" innerClassName="justify-end">
				{!plugin.isInstalled && (
					<Button variant="secondary" onClick={() => onInstall(plugin)} data-testid="PluginListItem__install">
						{t("COMMON.INSTALL")}
					</Button>
				)}

				{plugin.isInstalled && (
					<Dropdown
						toggleContent={
							<Button variant="secondary" size="icon" className="text-left">
								<Icon name="Settings" width={20} height={20} />
							</Button>
						}
						options={[
							{ label: t("COMMON.VIEW"), value: "view" },
							{ label: t("COMMON.DELETE"), value: "delete" },
						]}
						onSelect={(option: any) => {
							if (option.value === "delete") {
								onDelete(plugin);
							}
						}}
						dropdownClass="top-3 text-left"
					/>
				)}
			</TableCell>
		</TableRow>
	);
};
