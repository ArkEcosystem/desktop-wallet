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
		<tr data-testid={`PluginListItem--${plugin.id}`} className="border-b border-dashed border-theme-neutral-200">
			<td className="text-center">
				<ChangeNowLogo className="w-12 h-12" />
			</td>

			<td>
				<a href="#" className="font-semibold text-theme-primary-500 hover:text-theme-primary-400">
					{plugin.name}
				</a>
			</td>

			<td>
				<div className="flex items-center justify-between pr-16">
					<span>{plugin.author}</span>

					<div>
						{plugin.isOfficial && <Icon name="OfficialArkPlugin" width={15} height={15} />}
						{plugin.isGrant && <Icon name="Grant" width={16} height={16} />}
					</div>
				</div>
			</td>

			<td className="py-10">{t(`PLUGINS.CATEGORY.${plugin.category.toUpperCase()}`)}</td>

			<td className="py-10">
				<ReviewRating rating={plugin.rating} />
			</td>

			<td className="py-10">v {plugin.version}</td>

			<td className="py-10">{plugin.size}</td>
			<td className="py-10">{plugin.size}</td>

			<td className="w-16 text-right">
				{!plugin.isInstalled && (
					<Button variant="plain" onClick={() => onInstall(plugin)} data-testid="PluginListItem__install">
						{t("COMMON.INSTALL")}
					</Button>
				)}

				{plugin.isInstalled && (
					<Button variant="plain" size="icon" className="text-left">
						<div className="text-left">
							<Dropdown
								toggleIcon="Settings"
								options={[
									{ label: "View", value: "view" },
									{ label: "Delete", value: "delete" },
								]}
								onSelect={(option: any) => {
									if (option.value === "delete") {
										onDelete(plugin);
									}
								}}
							/>
						</div>
					</Button>
				)}
			</td>
		</tr>
	);
};
