import { images } from "app/assets/images";
import React from "react";
import { useTranslation } from "react-i18next";
const { MistakeBanner } = images.common;

type ErroStepProps = {
	title?: string;
	subtitle?: string;
};

export const ErrorStep = ({ title, subtitle }: ErroStepProps) => {
	const { t } = useTranslation();
	return (
		<div data-testid="ErrorStep">
			<h1 className="mb-8 md:text-4xl text-lg font-bold">{title || t("TRANSACTION.ERROR.TITLE")}</h1>
			<div className="mx-auto my-4 w-128">
				<MistakeBanner />
			</div>
			<div className="mt-8 text-md text-theme-secondary-text">{subtitle || t("TRANSACTION.ERROR.SUBTITLE")}</div>
		</div>
	);
};
