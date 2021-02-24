import { Page, Section } from "app/components/Layout";
import { useActiveProfile, useQueryParams } from "app/hooks";
import { InstallPlugin } from "domains/plugin/components/InstallPlugin";
import { PluginHeader } from "domains/plugin/components/PluginHeader";
import { PluginInfo } from "domains/plugin/components/PluginInfo";
import { PluginUninstallConfirmation } from "domains/plugin/components/PluginUninstallConfirmation/PluginUninstallConfirmation";
import { usePluginManagerContext } from "plugins";
import React, { useMemo } from "react";
import { useHistory } from "react-router-dom";

export const PluginDetails = () => {
	const activeProfile = useActiveProfile();
	const queryParams = useQueryParams();
	const history = useHistory();

	const [isUninstallOpen, setIsUninstallOpen] = React.useState(false);
	const [isInstallOpen, setIsInstallOpen] = React.useState(false);

	const { pluginPackages, pluginConfigurations, pluginManager, reportPlugin } = usePluginManagerContext();

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

	const handleReportPlugin = () => {
		reportPlugin(plugin!);
	};

	const handleLaunch = () => {
		history.push(`/profiles/${activeProfile.id()}/plugins/view?pluginId=${pluginId}`);
	};

	const handleOnDelete = () => {
		history.push(`/profiles/${activeProfile.id()}/plugins`);
	};

	const closeInstallModal = () => {
		setIsInstallOpen(false);
	};

	return (
		<Page profile={activeProfile}>
			<Section>
				<PluginHeader
					{...pluginData}
					isInstalled={isInstalled}
					onUninstall={() => setIsUninstallOpen(true)}
					onReport={handleReportPlugin}
					onInstall={() => setIsInstallOpen(true)}
					hasLaunch={hasLaunch}
					onLaunch={handleLaunch}
				/>
			</Section>

			<Section>
				<PluginInfo {...pluginData} isInstalled={isInstalled} hasLaunch={hasLaunch} onLaunch={handleLaunch} />
			</Section>

			{plugin && (
				<InstallPlugin
					plugin={plugin.toObject()}
					repositoryURL={repositoryURL!}
					isOpen={isInstallOpen}
					onClose={closeInstallModal}
					onCancel={closeInstallModal}
				/>
			)}

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
