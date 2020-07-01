import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { Dropdown } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import { ReviewRating } from "app/components/ReviewRating";
import React from "react";
import { useTranslation } from "react-i18next";

type PluginListItemProps = {
	onDelete: any;
	onInstall: any;
	plugin: any;
};

const { ChangeNowLogo } = images.exchange.components.AddExchange;

export const PluginListItem = ({ onDelete, onInstall, plugin }: PluginListItemProps) => {
	const { t } = useTranslation();

	return (
		<tr
			data-testid={`PluginListItem--${plugin.id}`}
			className="border-b border-dashed border-theme-neutral-200 text-theme-neutral-700"
		>
			<td className="w-16 text-center">
				<ChangeNowLogo className="w-12 h-12" />
			</td>

			<td>
				<div className="flex items-center space-x-2">
					<a href="#" className="font-semibold link">
						{plugin.name}
					</a>

					{plugin.isOfficial && <Icon name="OfficialArkPlugin" width={18} height={18} />}
					{plugin.isGrant && <Icon name="Grant" width={14} height={20} />}
				</div>
			</td>

			<td>
				<div className="flex items-center justify-between pr-16">{plugin.author}</div>
			</td>

			<td className="py-10">{t(`PLUGINS.CATEGORY.${plugin.category.toUpperCase()}`)}</td>

			<td className="py-10">
				<ReviewRating width={3} rating={plugin.rating} />
			</td>

			<td className="py-10">v {plugin.version}</td>

			<td className="py-10">{plugin.size}</td>

			<td className="flex py-10">
				{plugin.isInstalled && (
					<div className="flex w-6 h-6 mx-auto border-2 rounded-full border-theme-success-200 text-theme-success-500">
						<div className="m-auto">
							<Icon name="Checkmark" width={15} height={15} />
						</div>
					</div>
				)}

				{!plugin.isInstalled && (
					<div className="flex w-6 h-6 mx-auto">
						<div className="m-auto text-theme-neutral-500">
							<Icon name="Dash" width={15} height={15} />
						</div>
					</div>
				)}
			</td>

			<td className="w-16 text-right">
				{!plugin.isInstalled && (
					<Button variant="plain" onClick={() => onInstall(plugin)} data-testid="PluginListItem__install">
						{t("COMMON.INSTALL")}
					</Button>
				)}

				{plugin.isInstalled && (
					<Dropdown
						toggleContent={
							<Button variant="plain" size="icon" className="text-left">
								<Icon name="Settings" width={20} height={20} />
							</Button>
						}
						options={[
							{ label: "View", value: "view" },
							{ label: "Delete", value: "delete" },
						]}
						onSelect={(option: any) => {
							if (option.value === "delete") {
								onDelete(plugin);
							}
						}}
						dropdownClass="top-3 text-left"
					/>
				)}
			</td>
		</tr>
	);
};
