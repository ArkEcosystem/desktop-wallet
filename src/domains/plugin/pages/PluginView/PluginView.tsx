import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { Image } from "app/components/Image";
import { Page, Section } from "app/components/Layout";
import { Tooltip } from "app/components/Tooltip";
import { useActiveProfile, useQueryParams } from "app/hooks";
import { LaunchRender, usePluginManagerContext } from "plugins";
import React from "react";
import { useTranslation } from "react-i18next";

export const PluginView = () => {
	const queryParams = useQueryParams();
	const { t } = useTranslation();

	const profile = useActiveProfile();
	const { pluginManager } = usePluginManagerContext();

	const pluginId = queryParams.get("pluginId")!;
	const plugin = pluginManager.plugins().findById(pluginId);

	const crumbs = [
		{
			route: `/profiles/${profile.id()}/plugins`,
			label: t("PLUGINS.PAGE_PLUGIN_MANAGER.TITLE"),
		},
		{
			label: plugin!.config().title()!,
		},
	];

	return (
		<Page profile={profile} crumbs={crumbs}>
			<Section>
				<div className="flex justify-between items-center">
					<div className="flex items-center space-x-3">
						{plugin?.config().logo() ? (
							<img
								data-testid="PluginView__logo"
								src={plugin.config().logo()}
								alt="Logo"
								className="overflow-hidden w-12 h-12 rounded"
							/>
						) : (
							<Image name="PluginLogoPlaceholder" domain="plugin" className="w-12 h-12" />
						)}

						<div className="flex space-x-10 divide-x divide-theme-secondary-300 dark:divide-theme-secondary-700">
							<dl className="pl-6 first:pl-0">
								<dt className="text-sm font-bold text-theme-secondary-500">{t("COMMON.PLUGIN")}</dt>
								<dd className="font-bold text-theme-secondary-text dark:text-theme-text">
									{plugin?.config().title()}
								</dd>
							</dl>

							<dl className="pl-6 first:pl-0">
								<dt className="text-sm font-bold text-theme-secondary-500">{t("COMMON.CATEGORY")}</dt>
								<dd className="font-bold capitalize text-theme-secondary-text dark:text-theme-text">
									{plugin?.config().categories()?.[0]}
								</dd>
							</dl>

							<dl className="pl-6 first:pl-0">
								<dt className="text-sm font-bold text-theme-secondary-500">{t("COMMON.VERSION")}</dt>
								<dd className="font-bold text-theme-secondary-text dark:text-theme-text">
									v{plugin?.config().version()}
								</dd>
							</dl>

							<dl className="pl-6 first:pl-0">
								<dt className="text-sm font-bold text-theme-secondary-500">{t("COMMON.SIZE")}</dt>
								<dd className="font-bold text-theme-secondary-text dark:text-theme-text">
									{plugin?.config().size()}
								</dd>
							</dl>
						</div>
					</div>

					<div className="flex items-center space-x-2">
						<Tooltip content="Report this plugin">
							<Button size="icon">
								<Icon name="AlertWarning" width="1.5rem" height="1.25rem" />
							</Button>
						</Tooltip>

						<Tooltip content="Uninstall">
							<Button size="icon">
								<Icon name="Trash" width="1.5rem" height="1.25rem" />
							</Button>
						</Tooltip>
					</div>
				</div>
			</Section>

			<div className="flex relative flex-1 w-full h-full">
				<LaunchRender
					manager={pluginManager}
					pluginId={pluginId}
					fallback={<h1>Plugin not loaded or enabled</h1>}
				/>
			</div>
		</Page>
	);
};
