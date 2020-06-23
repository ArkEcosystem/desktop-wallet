import { images } from "app/assets/images";
import React from "react";
import { useTranslation } from "react-i18next";

const commonAssets = images.common;
const { CannotConnectBanner } = images.offline.pages.Offline;

export const Offline = () => {
	const { t } = useTranslation();

	return (
		<div className="w-full h-full">
			<div className="px-4 sm:px-6 lg:px-8">
				<div className="flex items-center flex-shrink-0 h-20 md:h-24">
					<div className="flex p-2 rounded-lg bg-logo">
						<img src={commonAssets.ARKLogo} className="h-6 md:h-8 lg:h-10" alt="ARK Logo" />
					</div>
				</div>
			</div>

			<div className="flex flex-col items-center justify-center my-4 text-center" data-testid="Offline">
				<div className="w-2/6 mx-auto">
					<CannotConnectBanner />
				</div>
				<div className="mt-8">
					<h3 className="text-xl font-bold xl:text-2xl">{t("OFFLINE.TITLE")}</h3>
					<p className="text-theme-neutral-dark">{t("OFFLINE.DESCRIPTION")}</p>
				</div>
			</div>
		</div>
	);
};
