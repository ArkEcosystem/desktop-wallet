import { Card } from "app/components/Card";
import { DropdownOption } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import React from "react";
import { useTranslation } from "react-i18next";

import { PluginImage } from "../PluginImage";

type PluginCardProps = {
	actions?: DropdownOption[];
	category?: string;
	plugin: any;
	onClick?: () => void;
	onSelect?: (action: any) => void;
	showCategory?: boolean;
};

export const BlankPluginCard = ({ name, category }: { name?: string; category?: string }) => {
	const { t } = useTranslation();

	return (
		<Card>
			<div className="flex items-center space-x-4">
				<div className="h-25 w-25 rounded-xl border-2 border-theme-primary-100 dark:border-theme-secondary-800" />
				<div className="flex flex-col truncate">
					<span className="text-sm font-semibold text-theme-primary-100 dark:text-theme-secondary-800 truncate">
						{t("COMMON.AUTHOR")}
					</span>

					<div className="mt-1 text-lg font-bold text-theme-primary-100 dark:text-theme-secondary-800 truncate">
						{name || t("COMMON.NAME")}
					</div>

					{category && (
						<div className="flex items-center space-x-2 mt-4 text-theme-primary-100 dark:text-theme-secondary-800">
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

export const PluginCard = ({ actions, category, plugin, onClick, onSelect, showCategory }: PluginCardProps) => {
	const { t } = useTranslation();

	if (plugin === undefined) {
		return <BlankPluginCard category={category} />;
	}

	return (
		<div data-testid={`PluginCard--${plugin.id}`}>
			<Card onClick={onClick} actions={actions} onSelect={onSelect}>
				<div className="flex items-center space-x-4">
					<div className="flex-shrink-0 w-25 h-25 overflow-hidden rounded-lg">
						<PluginImage logoURL={plugin.logo} />
					</div>

					<div className="flex flex-col truncate">
						<span className="text-sm font-semibold truncate text-theme-secondary-500 dark:text-theme-secondary-700">
							{plugin.author}
						</span>

						<div className="flex items-center space-x-2 mt-1 text-lg font-bold truncate text-theme-primary-600 dark:text-theme-secondary-200">
							<div className="truncate">{plugin.title}</div>

							<span>
								{plugin.isOfficial && <Icon name="OfficialArkPlugin" width={16} height={16} />}
								{plugin.isGrant && <Icon name="Grant" width={20} height={20} />}
							</span>
						</div>

						{showCategory && (
							<div className="flex items-center space-x-2 mt-4 dark:text-theme-secondary-600">
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
