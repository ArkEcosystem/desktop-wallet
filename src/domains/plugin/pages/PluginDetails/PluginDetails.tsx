import { Button } from "app/components/Button";
import { Page, Section } from "app/components/Layout";
import { useActiveProfile } from "app/hooks";
import { Comments } from "domains/plugin/components/Comments";
import { PluginHeader } from "domains/plugin/components/PluginHeader";
import { PluginInfo } from "domains/plugin/components/PluginInfo";
import { ReviewBox } from "domains/plugin/components/ReviewBox";
import React from "react";
import { useTranslation } from "react-i18next";

import { pluginData, reviewData } from "../../data";

const commentsSortOptions = {
	type: "Best",
	direction: "asc",
};

type PluginDetailsProps = {
	pluginData?: any;
	reviewData?: any;
	isInstalled?: boolean;
};

export const PluginDetails = ({ pluginData, reviewData, isInstalled }: PluginDetailsProps) => {
	const activeProfile = useActiveProfile();

	const { t } = useTranslation();

	const { author, about, permissions, screenshots, category, url, averageRating, version, size } = pluginData;
	const { comments, ratings, totalAvaliations } = reviewData;

	const crumbs = [
		{
			route: `/profiles/${activeProfile.id()}/plugins`,
			label: t("PLUGINS.GO_BACK_TO_PLUGIN_STORE"),
		},
	];

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section>
				<PluginHeader
					author={author}
					category={category}
					url={url}
					rating={averageRating}
					version={version}
					size={size}
					isInstalled={isInstalled}
				/>
			</Section>

			<Section>
				<PluginInfo about={about} permissions={permissions} screenshots={screenshots} />
			</Section>

			<Section>
				<div className="flex">
					<div className="flex flex-col">
						<div className="flex items-center justify-between">
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
						className="p-8 mb-auto ml-32 border-2 border-theme-neutral-300 dark:border-theme-neutral-800 rounded-xl"
						data-testid="plugin-details__review-box"
					>
						<ReviewBox averageScore={averageRating} ratings={ratings} totalAvaliations={totalAvaliations} />
					</div>
				</div>
			</Section>
		</Page>
	);
};

PluginDetails.defaultProps = {
	isInstalled: false,
	pluginData,
	reviewData,
};
