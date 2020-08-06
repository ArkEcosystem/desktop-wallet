import { DateTime } from "@arkecosystem/platform-sdk-intl";
import { images } from "app/assets/images";
import { CircularProgressBar } from "app/components/CircularProgressBar";
import { Divider } from "app/components/Divider";
import { Page, Section } from "app/components/Layout";
import React from "react";
import { useTranslation } from "react-i18next";

import { version } from "../../../../../package.json";

const { SplashBanner } = images.splash.pages.splash;
const commonAssets = images.common;

export const Splash = ({ year }: any) => {
	const { t } = useTranslation();

	const currentYear = year || DateTime.make().format("YYYY");

	return (
		<Page navbarStyle="logo-only">
			<Section className="flex flex-col justify-center flex-1 text-center">
				<div className="w-64 mx-auto lg:w-128">
					<div className="ml-6">
						<SplashBanner />
					</div>
				</div>

				<div data-testid="Splash__text" className="mt-8">
					<h1 className="text-4xl font-extrabold">{t("SPLASH.BRAND")}</h1>
					<p className="text-theme-neutral-dark animate-pulse">{t("SPLASH.LOADING")}</p>
					<div className="justify-center flex mt-4">
						<div className="animate-spin">
							<CircularProgressBar
								showValue={false}
								value={20}
								strokeWidth={2}
								size={40}
								progressColor="var(--theme-color-primary)"
							 />
						</div>
					</div>
				</div>
				<div
					data-testid="Splash__footer"
					className="fixed bottom-4 left-0 right-0 flex justify-center items-center font-semibold text-sm text-theme-neutral-500"
				>
					<div>
						{currentYear} {t("SPLASH.COPYRIGHT")}
					</div>
					<Divider type="vertical" />
					<div>{t("SPLASH.RIGHTS")}</div>
					<Divider type="vertical" />
					<img
						src={commonAssets.ARKLogo}
						className="h-4 w-4 bg-theme-neutral-500 rounded-sm p-px mr-2"
						alt={t("SPLASH.BRAND")}
					/>
					<div>{t("SPLASH.PRODUCT")}</div>
					<Divider type="vertical" />
					<div>
						{t("SPLASH.VERSION")} {version}
					</div>
				</div>
			</Section>
		</Page>
	);
};
