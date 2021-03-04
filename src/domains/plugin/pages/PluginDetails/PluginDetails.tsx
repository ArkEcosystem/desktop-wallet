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

	const {
		allPlugins,
		pluginConfigurations,
		pluginManager,
		reportPlugin,
		trigger,
		mapConfigToPluginData,
		updatePlugin,
		updatingStats,
	} = usePluginManagerContext();

	const pluginId = queryParams.get("pluginId");
	const repositoryURL = queryParams.get("repositoryURL");

	const pluginCtrl = pluginManager.plugins().findById(pluginId!);
	const isInstalled = !!pluginCtrl;
	const hasLaunch = !!pluginCtrl?.hooks().hasCommand("service:launch.render");

	const latestConfiguration = useMemo(() => pluginConfigurations.find((item) => item.id() === pluginId), [
		pluginConfigurations,
		pluginId,
	]);
	const packageConfiguration = useMemo(() => allPlugins.find((item) => item.id() === pluginId), [
		allPlugins,
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

	const pluginData = (plugin && mapConfigToPluginData(activeProfile, plugin)) || ({} as any);

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
			<Section border>
				<PluginHeader
					{...pluginData}
					isInstalled={isInstalled}
					onDelete={() => setIsUninstallOpen(true)}
					onReport={handleReportPlugin}
					onInstall={() => setIsInstallOpen(true)}
					onEnable={() => {
						pluginCtrl?.enable(activeProfile, { autoRun: true });
						trigger();
					}}
					onDisable={() => {
						pluginCtrl?.disable(activeProfile);
						trigger();
					}}
					onUpdate={() => updatePlugin(pluginData.name)}
					updatingStats={updatingStats?.[pluginData.name]}
					hasLaunch={hasLaunch}
					onLaunch={handleLaunch}
				/>
			</Section>

			<Section>
				<PluginInfo {...pluginData} />
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
