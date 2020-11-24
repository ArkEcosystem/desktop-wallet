import { OriginalButton } from "app/components/Button";
import { Image } from "app/components/Image";
import { Page, Section } from "app/components/Layout";
import { useDarkMode } from "app/hooks";
import React from "react";
import { FallbackProps } from "react-error-boundary";
import { useTranslation } from "react-i18next";

export const ApplicationError = ({ resetErrorBoundary }: FallbackProps) => {
	const { t } = useTranslation();

	return (
		<main className={`theme-${useDarkMode() ? "dark" : "light"}`} data-testid="Main">
			<Page navbarVariant="logo-only">
				<Section className="flex flex-col justify-center flex-1 text-center">
					<div className="w-64 mx-auto lg:w-128">
						<Image name="ErrorBanner" domain="error" />
					</div>

					<div data-testid="ApplicationError__text" className="mt-8">
						<h2 className="text-2xl font-bold">{t("ERROR.APPLICATION.TITLE")}</h2>
						<p className="text-theme-secondary-text">{t("ERROR.APPLICATION.DESCRIPTION")}</p>
					</div>

					<OriginalButton
						color="primary"
						variant="solid"
						data-testid="ApplicationError__button--reload"
						onClick={resetErrorBoundary}
						className="mt-8"
					>
						{t("ERROR.APPLICATION.RELOAD")}
					</OriginalButton>
				</Section>
			</Page>
		</main>
	);
};
