import { Page, Section } from "app/components/Layout";
import { useActiveProfile, useQueryParams } from "app/hooks";
import { PluginHeader } from "domains/plugin/components/PluginHeader";
import { PluginInfo } from "domains/plugin/components/PluginInfo";
import { PluginUninstallConfirmation } from "domains/plugin/components/PluginUninstallConfirmation/PluginUninstallConfirmation";
import { usePluginManagerContext } from "plugins";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

export const PluginDetails = () => {
	const activeProfile = useActiveProfile();
	const queryParams = useQueryParams();
	const history = useHistory();

	const [isUninstallOpen, setIsUninstallOpen] = React.useState(false);

	const { t } = useTranslation();
	const { pluginPackages, pluginConfigurations, pluginManager, reportPlugin } = usePluginManagerContext();

	const pluginId = queryParams.get("pluginId");
	const pluginCtrl = pluginManager.plugins().findById(pluginId!);
	const isInstalled = !!pluginCtrl;

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

	const crumbs = [
		{
			label: t("PLUGINS.PAGE_PLUGIN_MANAGER.TITLE"),
			route: `/profiles/${activeProfile.id()}/plugins`,
		},
		{
			label: pluginData.title,
		},
	];

	const handleReportPlugin = () => {
		reportPlugin(pluginCtrl!);
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
					onUninstall={() => setIsUninstallOpen(true)}
					onReport={handleReportPlugin}
				/>
			</Section>

			<Section>
				<PluginInfo {...pluginData} isInstalled={isInstalled} />
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
