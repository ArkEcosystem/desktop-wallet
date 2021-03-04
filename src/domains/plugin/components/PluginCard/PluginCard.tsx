import { Card } from "app/components/Card";
import { DropdownOption } from "app/components/Dropdown";
import { Icon } from "app/components/Icon";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { PluginImage } from "../PluginImage";

type PluginCardProps = {
	plugin: any;
	onClick?: () => void;
	onDisable?: () => void;
	onEnable?: () => void;
	onDelete?: () => void;
	onLaunch?: () => void;
	onInstall?: () => void;
	onUpdate?: () => void;
};

export const PluginCard = ({
	plugin,
	onClick,
	onEnable,
	onDisable,
	onDelete,
	onLaunch,
	onInstall,
	onUpdate,
}: PluginCardProps) => {
	const { t } = useTranslation();

	const actions = useMemo(() => {
		if (plugin.isInstalled) {
			const result: DropdownOption[] = [];

			if (plugin.hasLaunch) {
				result.push({ label: t("COMMON.LAUNCH"), value: "launch" });
			}

			if (plugin.hasUpdateAvailable) {
				result.push({
					label: t("COMMON.UPDATE"),
					value: "update",
					disabled: plugin.isMinimumVersionSatisfied === false,
				});
			}

			if (plugin.isEnabled) {
				result.push({ label: t("COMMON.DISABLE"), value: "disable" });
			} else {
				result.push({ label: t("COMMON.ENABLE"), value: "enable" });
			}

			result.push({ label: t("COMMON.DELETE"), value: "delete" });

			return result;
		}

		return [
			{
				label: t("COMMON.INSTALL"),
				value: "install",
			},
		];
	}, [t, plugin]);

	return (
		<div data-testid={`PluginCard--${plugin.id}`}>
			<Card
				onClick={onClick}
				actions={actions}
				className="h-52"
				onSelect={(action: any) => {
					if (action.value === "delete") {
						onDelete?.();
					}
					if (action.value === "enable") {
						onEnable?.();
					}
					if (action.value === "disable") {
						onDisable?.();
					}
					if (action.value === "launch") {
						onLaunch?.();
					}
					if (action.value === "install") {
						onInstall?.();
					}
					if (action.value === "update") {
						onUpdate?.();
					}
				}}
			>
				<div className="flex flex-col h-full items-between">
					<PluginImage logoURL={plugin.logo} className="mb-4 mr-4 w-20 h-20" />

					<div>
						<div className="flex items-center mb-2 space-x-2 text-lg font-semibold text-theme-primary-600">
							<div className="truncate">{plugin.title}</div>

							<div>
								{plugin.isOfficial && <Icon name="OfficialArkPlugin" width={16} height={16} />}
								{plugin.isGrant && <Icon name="Grant" width={20} height={20} />}
							</div>
						</div>

						<div className="flex space-x-4 text-sm text-theme-secondary-500 dark:text-theme-secondary-700">
							<div className="pr-4 border-theme-secondary-300 dark:border-theme-secondary-800">
								{plugin.author}
							</div>
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
};

PluginCard.defaultProps = {
	isOwner: false,
};
