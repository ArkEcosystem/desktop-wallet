import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { Page, Section } from "app/components/Layout";
import { Tooltip } from "app/components/Tooltip";
import { useActiveProfile } from "app/hooks";
import { PluginUninstallConfirmation } from "domains/plugin/components/PluginUninstall";
import { PluginLaunchRender, usePluginManagerContext } from "plugins";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export const PluginView = () => {
	const { pluginId } = useParams();
	const { t } = useTranslation();

	const profile = useActiveProfile();
	const { pluginManager, reportPlugin } = usePluginManagerContext();

	const [isUninstallConfirmationOpen, setIsUninstallConfirmationOpen] = useState(false);
	const plugin = pluginManager.plugins().findById(+pluginId);

	const crumbs = [
		{
			route: `/profiles/${profile.id()}/plugins/${pluginId}`,
			label: t("PLUGINS.GO_BACK_TO_PLUGIN_MANAGER"),
		},
	];

	return (
		<Page profile={profile} crumbs={crumbs}>
			<Section>
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						{plugin?.config().logo() ? (
							<img src={plugin.config().logo()} alt={plugin.config().name()} />
						) : (
							<Avatar address={`${plugin?.config().id()}`} rounded={false} className="rounded" noShadow />
						)}

						<div className="flex space-x-10 divide-x divide-theme-neutral-300 dark:divide-theme-neutral-700">
							<dl className="first:pl-0 pl-6">
								<dt className="text-sm font-bold text-theme-neutral-light">{t("COMMON.PLUGIN")}</dt>
								<dd className="font-bold text-theme-neutral-600">{plugin?.config().title()}</dd>
							</dl>

							<dl className="first:pl-0 pl-6">
								<dt className="text-sm font-bold text-theme-neutral-light">{t("COMMON.CATEGORY")}</dt>
								<dd className="font-bold text-theme-neutral-600 capitalize">
									{plugin?.config().categories()?.[0]}
								</dd>
							</dl>

							<dl className="first:pl-0 pl-6">
								<dt className="text-sm font-bold text-theme-neutral-light">{t("COMMON.SIZE")}</dt>
								<dd className="font-bold text-theme-neutral-600">{plugin?.config().size()}</dd>
							</dl>

							<dl className="first:pl-0 pl-6">
								<dt className="text-sm font-bold text-theme-neutral-light">{t("COMMON.VERSION")}</dt>
								<dd className="font-bold text-theme-neutral-600">v{plugin?.config().version()}</dd>
							</dl>
						</div>
					</div>

					<div className="flex items-center space-x-2">
						<Tooltip content="Report this plugin">
							<Button size="icon" onClick={() => reportPlugin(plugin!)}>
								<Icon name="AlertWarning" width="1.5rem" height="1.25rem" />
							</Button>
						</Tooltip>

						<Tooltip content="Uninstall">
							<Button size="icon" onClick={() => setIsUninstallConfirmationOpen(true)}>
								<Icon name="Trash" width="1.5rem" height="1.25rem" />
							</Button>
						</Tooltip>
					</div>
				</div>
			</Section>

			<div className="flex-1 h-full w-full flex relative">
				<PluginLaunchRender pluginId={+pluginId} fallback={<h1>Plugin not loaded or enabled</h1>} />
			</div>

			<PluginUninstallConfirmation
				isOpen={isUninstallConfirmationOpen}
				profile={profile}
				plugin={plugin!}
				onCancel={() => setIsUninstallConfirmationOpen(false)}
				onClose={() => setIsUninstallConfirmationOpen(false)}
				onDelete={() => setIsUninstallConfirmationOpen(false)}
			/>
		</Page>
	);
};
