import { images } from "app/assets/images";
import React from "react";
import { useTranslation } from "react-i18next";
import tw, { styled } from "twin.macro";

const commonAssets = images.common;
const { CannotConnectBanner } = images.offline.pages.Offline;

const Container = styled.div`
	${tw`flex flex-col items-center justify-center text-center`}
	height: calc(100vh - 140px);
`;

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

			<Container data-testid="Offline">
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<CannotConnectBanner />
				</div>
				<div className="mt-8">
					<h2 className="text-2xl font-bold">{t("OFFLINE.TITLE")}</h2>
					<p className="text-theme-neutral-dark">{t("OFFLINE.DESCRIPTION")}</p>
				</div>
			</Container>
		</div>
	);
};
