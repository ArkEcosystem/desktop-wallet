import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { Image } from "app/components/Image";
import { Page, Section } from "app/components/Layout";
import { Tooltip } from "app/components/Tooltip";
import { useActiveProfile } from "app/hooks";
import { LaunchRender, usePluginManagerContext } from "plugins";
import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export const PluginView = () => {
	const { pluginId } = useParams();
	const { t } = useTranslation();

	const profile = useActiveProfile();
	const { pluginManager } = usePluginManagerContext();

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
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						{plugin?.config().logo() ? (
							<img
								data-testid="PluginListItem__logo"
								src={plugin.config().logo()}
								alt="Logo"
								className="overflow-hidden w-12 h-12 rounded"
							/>
						) : (
							<Image name="PluginLogoPlaceholder" domain="plugin" className="w-12 h-12" />
						)}

						<div className="flex space-x-10 divide-x divide-theme-secondary-300 dark:divide-theme-secondary-700">
							<dl className="first:pl-0 pl-6">
								<dt className="text-sm font-bold text-theme-secondary-500">{t("COMMON.PLUGIN")}</dt>
								<dd className="font-bold text-theme-secondary-text dark:text-theme-text">
									{plugin?.config().title()}
								</dd>
							</dl>

							<dl className="first:pl-0 pl-6">
								<dt className="text-sm font-bold text-theme-secondary-500">{t("COMMON.CATEGORY")}</dt>
								<dd className="font-bold text-theme-secondary-text dark:text-theme-text capitalize">
									{plugin?.config().categories()?.[0]}
								</dd>
							</dl>

							<dl className="first:pl-0 pl-6">
								<dt className="text-sm font-bold text-theme-secondary-500">{t("COMMON.VERSION")}</dt>
								<dd className="font-bold text-theme-secondary-text dark:text-theme-text">
									v{plugin?.config().version()}
								</dd>
							</dl>

							<dl className="first:pl-0 pl-6">
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

			<div className="flex-1 h-full w-full flex relative">
				<LaunchRender
					manager={pluginManager}
					pluginId={pluginId}
					fallback={<h1>Plugin not loaded or enabled</h1>}
				/>
			</div>
		</Page>
	);
};
