import { Button } from "app/components/Button";
import { NavigationBar } from "app/components/NavigationBar";
import { Comments } from "domains/plugin/components/Comments";
import { PluginHeader } from "domains/plugin/components/PluginHeader";
import { PluginInfo } from "domains/plugin/components/PluginInfo";
import { ReviewBox } from "domains/plugin/components/ReviewBox";
import React from "react";

const commentsSortOptions = {
	type: "Best",
	direction: "asc",
};

type PluginDetailsProps = {
	pluginData: any;
	reviewData: any;
	isInstalled?: boolean;
};

export const PluginDetails = ({ pluginData, reviewData, isInstalled }: PluginDetailsProps) => {
	const { author, about, permissions, screenshots, category, url, averageRating, version, size } = pluginData;
	const { comments, ratings, totalAvaliations } = reviewData;

	return (
		<div data-testid="plugin-details__header">
			<NavigationBar currencyIcon="Ark" balance="34,253.75" userInitials="IO" />

			<section className="bg-theme-neutral-100 h-full -m-5">
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

				<div className="bg-theme-background flex p-10 mt-5">
					<div className="flex flex-col">
						<div className="flex items-center justify-between">
							<h2 className="mb-0">Reviews ARK Explorer</h2>
							<Button data-testid="ReviewBox__button--comment" variant="plain">
								Leave a comment
							</Button>
						</div>

						<div className="col-span-2" data-testid="plugin-details__comments">
							<Comments comments={comments} sortOptions={commentsSortOptions} />
						</div>
					</div>

					<div
						className="border-theme-neutral-200 rounded-xl p-8 mb-auto ml-32 border-2"
						data-testid="plugin-details__review-box"
					>
						<ReviewBox averageScore={averageRating} ratings={ratings} totalAvaliations={totalAvaliations} />
					</div>
				</div>
			</section>
		</div>
	);
};

PluginDetails.defaultProps = {
	isInstalled: false,
};
