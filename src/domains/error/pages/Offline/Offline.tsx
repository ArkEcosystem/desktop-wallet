import { Image } from "app/components/Image";
import { Page, Section } from "app/components/Layout";
import React from "react";
import { useTranslation } from "react-i18next";

export const Offline = () => {
	const { t } = useTranslation();

	return (
		<Page navbarVariant="logo-only">
			<Section className="flex flex-col flex-1 justify-center text-center">
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<Image name="ConnectionError" domain="error" />
				</div>

				<div data-testid="Offline__text" className="mt-8">
					<h2 className="text-2xl font-bold">{t("ERROR.OFFLINE.TITLE")}</h2>
					<p className="text-theme-secondary-text">{t("ERROR.OFFLINE.DESCRIPTION")}</p>
				</div>
			</Section>
		</Page>
	);
};
