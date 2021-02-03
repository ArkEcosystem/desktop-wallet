import { Button } from "app/components/Button";
import { Page, Section } from "app/components/Layout";
import { useActiveProfile, useQueryParams } from "app/hooks";
import { Comments } from "domains/plugin/components/Comments";
import { PluginHeader } from "domains/plugin/components/PluginHeader";
import { PluginInfo } from "domains/plugin/components/PluginInfo";
import { ReviewBox } from "domains/plugin/components/ReviewBox";
import { usePluginManagerContext } from "plugins";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { reviewData } from "../../data";

const commentsSortOptions = {
	type: "Best",
	direction: "asc",
};

type PluginDetailsProps = {
	reviewData?: any;
};

export const PluginDetails = ({ reviewData }: PluginDetailsProps) => {
	const activeProfile = useActiveProfile();
	const queryParams = useQueryParams();

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
	const { comments, ratings, totalAvaliations } = reviewData;

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

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section>
				<PluginHeader {...pluginData} isInstalled={isInstalled} onReport={handleReportPlugin} />
			</Section>

			<Section>
				<PluginInfo {...pluginData} isInstalled={isInstalled} />
			</Section>

			<Section>
				<div className="flex">
					<div className="flex flex-col">
						<div className="flex justify-between items-center">
							<h2 className="mb-0">Reviews ARK Explorer</h2>
							<Button data-testid="ReviewBox__button--comment" variant="secondary">
								Leave a comment
							</Button>
						</div>

						<div className="col-span-2" data-testid="plugin-details__comments">
							<Comments comments={comments} sortOptions={commentsSortOptions} />
						</div>
					</div>

					<div
						className="p-8 mb-auto ml-32 rounded-xl border-2 border-theme-secondary-300 dark:border-theme-secondary-800"
						data-testid="plugin-details__review-box"
					>
						<ReviewBox averageScore={""} ratings={ratings} totalAvaliations={totalAvaliations} />
					</div>
				</div>
			</Section>
		</Page>
	);
};

PluginDetails.defaultProps = {
	reviewData,
};
