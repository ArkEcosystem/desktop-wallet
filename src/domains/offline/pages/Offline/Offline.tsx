import { images } from "app/assets/images";
import { Page, Section } from "app/components/Layout";
import React from "react";
import { useTranslation } from "react-i18next";

const commonAssets = images.common;
const { CannotConnectBanner } = images.offline.pages.Offline;

export const Offline = () => {
	const { t } = useTranslation();

	return (
		<Page navbarStyle="logo-only">
			<Section className="flex flex-col justify-center flex-1">
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<CannotConnectBanner />
				</div>

				<div data-testid="Offline__text" className="mt-8 text-center">
					<h2 className="text-2xl font-bold">{t("OFFLINE.TITLE")}</h2>
					<p className="text-theme-neutral-dark">{t("OFFLINE.DESCRIPTION")}</p>
				</div>
			</Section>
		</Page>
	);
};
