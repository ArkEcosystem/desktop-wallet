import { images } from "app/assets/images";
import { Page, Section } from "app/components/Layout";
import React from "react";
import { useTranslation } from "react-i18next";

const { CannotConnectBanner } = images.error.pages.Offline;

export const Offline = () => {
	const { t } = useTranslation();

	return (
		<Page navbarVariant="logo-only">
			<Section className="flex flex-col justify-center flex-1 text-center">
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<CannotConnectBanner />
				</div>

				<div data-testid="Offline__text" className="mt-8">
					<h2 className="text-2xl font-bold">{t("ERROR.OFFLINE.TITLE")}</h2>
					<p className="text-theme-secondary-text">{t("ERROR.OFFLINE.DESCRIPTION")}</p>
				</div>
			</Section>
		</Page>
	);
};
