import { images } from "app/assets/images";
import { SvgCollection } from "app/assets/svg";
import BlockfolioBanner from "domains/news/images/blockfolio-banner.jpg";
import React from "react";

const { DownloadAppStoreButton, DownloadGooglePlayButton } = images.news.common;

export const BlockfolioAd = () => (
	<div className="relative pt-6">
		<div
			className="absolute text-center rounded-b-full bg-theme-primary-contrast right-4"
			style={{ width: 28, height: 29 }}
		>
			<span className="text-xs font-semibold text-theme-primary">Ad</span>
		</div>
		<img
			src={BlockfolioBanner}
			className="w-full border-2 rounded-xl border-theme-primary-contrast"
			alt="Blockfolio Banner"
		/>
		<div className="absolute top-24 left-10">
			<div className="flex flex-col space-y-5 text-theme-background">
				<SvgCollection.Blockfolio className="-mx-8" width={238} height={47} />
				<p className="w-3/4 text-lg font-medium">
					{"The world's most popular Bitcoin & cryptocurrency portfolio tracker. 100% free."}
				</p>
			</div>
			<div className="flex mt-12 space-x-2">
				<DownloadAppStoreButton className="w-32 h-10 b-0" />
				<DownloadGooglePlayButton className="w-32 h-10" />
			</div>
		</div>
	</div>
);
