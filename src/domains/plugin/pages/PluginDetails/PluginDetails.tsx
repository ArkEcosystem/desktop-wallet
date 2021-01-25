import { Button } from "app/components/Button";
import { Page, Section } from "app/components/Layout";
import { useActiveProfile } from "app/hooks";
import { Comments } from "domains/plugin/components/Comments";
import { PluginHeader } from "domains/plugin/components/PluginHeader";
import { PluginInfo } from "domains/plugin/components/PluginInfo";
import { ReviewBox } from "domains/plugin/components/ReviewBox";
import { usePluginManagerContext } from "plugins";
import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { reviewData } from "../../data";

const commentsSortOptions = {
	type: "Best",
	direction: "asc",
};

type PluginDetailsProps = {
	reviewData?: any;
	isInstalled?: boolean;
};

export const PluginDetails = ({ reviewData }: PluginDetailsProps) => {
	const activeProfile = useActiveProfile();

	const { t } = useTranslation();
	const { pluginId } = useParams();
	const { pluginPackages, pluginManager } = usePluginManagerContext();
	const pluginData = pluginPackages.find((item) => item.id().toString() === pluginId)?.toObject() || ({} as any);
	const { comments, ratings, totalAvaliations } = reviewData;
	const isInstalled = !!pluginManager.plugins().findById(+pluginId);

	const crumbs = [
		{
			label: t("PLUGINS.PAGE_PLUGIN_MANAGER.TITLE"),
			route: `/profiles/${activeProfile.id()}/plugins`,
		},
		{
			label: pluginData.title,
		},
	];

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section>
				<PluginHeader {...pluginData} isInstalled={isInstalled} />
			</Section>

			<Section>
				<PluginInfo {...pluginData} />
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
