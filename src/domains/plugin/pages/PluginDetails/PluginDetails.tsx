import { Comments } from "domains/plugin/components/Comments";
import { PluginHeader } from "domains/plugin/components/PluginHeader";
import { PluginInfo } from "domains/plugin/components/PluginInfo";
import { ReviewBox } from "domains/plugin/components/ReviewBox";
import React from "react";

const commentsSortingOptions = [
	{ label: "Best", value: "best" },
	{ label: "Date", value: "date" },
];

type PluginDetailsProps = {
	pluginData: any;
	reviewData: any;
	isInstalled?: boolean;
};

export const PluginDetails = ({ pluginData, reviewData, isInstalled }: PluginDetailsProps) => {
	const { author, about, permissions, screenshots, category, url, averageRating, version, size } = pluginData;
	const { comments, ratings, totalAvaliations } = reviewData;
	return (
		<section className="h-full bg-theme-neutral-100" data-testid="plugin-details__header">
			<PluginHeader
				author={author}
				category={category}
				url={url}
				rating={averageRating}
				version={version}
				size={size}
				isInstalled={isInstalled}
			/>
			<PluginInfo about={about} permissions={permissions} screenshots={screenshots} />
			<div className="mt-5 bg-theme-background">
				<div className="py-24 mx-10 grid grid-cols-2 grid-flow-col divide-x divide-theme-neutral-300">
					<div className="col-span-2" data-testid="plugin-details__comments">
						<Comments comments={comments} sortOptions={commentsSortingOptions} />
					</div>
					<div className="pl-10" data-testid="plugin-details__review-box">
						<ReviewBox averageScore={averageRating} ratings={ratings} totalAvaliations={totalAvaliations} />
					</div>
				</div>
			</div>
		</section>
	);
};

PluginDetails.defaultProps = {
	isInstalled: false,
};
