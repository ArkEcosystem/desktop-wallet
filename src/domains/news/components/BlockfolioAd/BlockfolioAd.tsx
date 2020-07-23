import { images } from "app/assets/images";
import { SvgCollection } from "app/assets/svg";
import BlockfolioBanner from "domains/news/images/blockfolio-banner.png";
import React from "react";
import { useTranslation } from "react-i18next";

const { DownloadAppStoreButton, DownloadGooglePlayButton } = images.news.common;

export const BlockfolioAd = () => {
	const { t } = useTranslation();

	return (
		<div className="relative">
			<div className="absolute top-0 flex text-center rounded-b-xl bg-theme-primary-contrast right-4">
				<span className="px-2 pt-1 pb-2 text-xs font-semibold text-theme-primary">{t("NEWS.AD")}</span>
			</div>
			<img
				src={BlockfolioBanner}
				className="w-full border-2 rounded-lg border-theme-primary-contrast"
				alt="Blockfolio Banner"
			/>
			<div className="absolute top-24 left-10">
				<div className="flex flex-col space-y-5 text-theme-background">
					<a href="https://blockfolio.com/" rel="noopener noreferrer" target="_blank">
						<SvgCollection.Blockfolio className="-mx-8" width={238} height={47} />
					</a>
					<p className="w-3/4 text-lg font-medium">
						{"The world's most popular Bitcoin & cryptocurrency portfolio tracker. 100% free."}
					</p>
				</div>
				<div className="flex mt-12 space-x-2">
					<a
						href="https://itunes.apple.com/us/app/blockfolio-bitcoin-altcoin/id1095564685?mt=8"
						rel="noopener noreferrer"
						target="_blank"
					>
						<DownloadAppStoreButton className="w-32 h-10 b-0" />
					</a>
					<a
						href="https://play.google.com/store/apps/details?id=com.blockfolio.blockfolio&amp;hl=en_US"
						rel="noopener noreferrer"
						target="_blank"
					>
						<DownloadGooglePlayButton className="w-32 h-10" />
					</a>
				</div>
			</div>
		</div>
	);
};
