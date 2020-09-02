import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { Page, Section } from "app/components/Layout";
import React from "react";
import { useTranslation } from "react-i18next";

const { ErrorBanner } = images.error.pages.ApplicationError;

export const ApplicationError = ({ resetErrorBoundary }: any) => {
	const { t } = useTranslation();

	return (
		<Page navbarVariant="logo-only">
			<Section className="flex flex-col justify-center flex-1 text-center">
				<div className="w-64 mx-auto lg:w-128">
					<ErrorBanner />
				</div>

				<div data-testid="ApplicationError__text" className="mt-8">
					<h2 className="text-2xl font-bold">{t("ERROR.APPLICATION.TITLE")}</h2>
					<p className="text-theme-neutral-dark">{t("ERROR.APPLICATION.DESCRIPTION")}</p>
				</div>

				<Button onClick={resetErrorBoundary} className="mt-8">
					{t("ERROR.APPLICATION.RELOAD")}
				</Button>
			</Section>
		</Page>
	);
};
