import { Page, Section } from "app/components/Layout";
import { useActiveProfile, useQueryParams } from "app/hooks";
import { toasts } from "app/services";
import { PluginHeader } from "domains/plugin/components/PluginHeader";
import { PluginInfo } from "domains/plugin/components/PluginInfo";
import { PluginUninstallConfirmation } from "domains/plugin/components/PluginUninstallConfirmation/PluginUninstallConfirmation";
import { usePluginManagerContext } from "plugins";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

export const PluginDetails = () => {
	const activeProfile = useActiveProfile();
	const queryParams = useQueryParams();
	const history = useHistory();

	const [isUninstallOpen, setIsUninstallOpen] = React.useState(false);

	const { t } = useTranslation();
	const { pluginPackages, pluginConfigurations, pluginManager, installPlugin } = usePluginManagerContext();

	const pluginId = queryParams.get("pluginId");
	const repositoryURL = queryParams.get("repositoryURL");

	const pluginCtrl = pluginManager.plugins().findById(pluginId!);
	const isInstalled = !!pluginCtrl;
	const hasLaunch = !!pluginCtrl?.hooks().hasCommand("service:launch.render");

	const latestConfiguration = useMemo(() => pluginConfigurations.find((item) => item.id() === pluginId), [
		pluginConfigurations,
		pluginId,
	]);
	const packageConfiguration = useMemo(() => pluginPackages.find((item) => item.id() === pluginId), [
		pluginPackages,
		pluginId,
	]);

	const plugin = useMemo(() => {
		// Installed plugins should display the configuration
		// of the downloaded version and the latest one only if the user updates it.
		if (isInstalled) {
			return packageConfiguration;
		}
		return latestConfiguration || packageConfiguration;
	}, [isInstalled, packageConfiguration, latestConfiguration]);

	const pluginData = plugin?.toObject() || ({} as any);

	const { title } = pluginData;

	const crumbs = [
		{
			label: t("PLUGINS.PAGE_PLUGIN_MANAGER.TITLE"),
			route: `/profiles/${activeProfile.id()}/plugins`,
		},
		{
			label: title,
		},
	];

	const handleInstallPlugin = useCallback(async () => {
		try {
			await installPlugin(pluginId!, repositoryURL!);
			toasts.success(`The plugin "${title}" was successfully installed`);
		} catch {
			toasts.error(`Failed to install plugin "${title}"`);
		}
	}, [installPlugin, pluginId, repositoryURL, title]);

	const handleLaunch = () => {
		history.push(`/profiles/${activeProfile.id()}/plugins/view?pluginId=${pluginId}`);
	};

	const handleOnDelete = () => {
		history.push(`/profiles/${activeProfile.id()}/plugins`);
	};

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section>
				<PluginHeader
					{...pluginData}
					isInstalled={isInstalled}
					onInstall={handleInstallPlugin}
					hasLaunch={hasLaunch}
					onLaunch={handleLaunch}
					onUninstall={() => setIsUninstallOpen(true)}
				/>
			</Section>

			<Section>
				<PluginInfo {...pluginData} isInstalled={isInstalled} hasLaunch={hasLaunch} onLaunch={handleLaunch} />
			</Section>

			{pluginCtrl && (
				<PluginUninstallConfirmation
					isOpen={isUninstallOpen}
					plugin={pluginCtrl}
					profile={activeProfile}
					onClose={() => setIsUninstallOpen(false)}
					onDelete={handleOnDelete}
				/>
			)}
		</Page>
	);
};
