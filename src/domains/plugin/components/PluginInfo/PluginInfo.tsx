import { Alert } from "app/components/Alert";
import { Slider } from "app/components/Slider";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
	description?: string;
	permissions?: any;
	images?: any;
	minimumVersion?: string;
};

export const PluginInfo = ({ description, permissions, images, minimumVersion }: Props) => {
	const { t } = useTranslation();
	const hasRequirements = !!minimumVersion;

	return (
		<>
			{description ? (
				<div>
					<p className="font-bold">{t("PLUGINS.PLUGIN_INFO.ABOUT")}</p>
					<p className="mt-3 text-theme-secondary-600" data-testid="plugin-info__about">
						{description}
					</p>
				</div>
			) : null}

			{permissions.length ? (
				<div className="mt-8">
					<p className="font-bold">{t("PLUGINS.PLUGIN_INFO.PERMISSIONS")}</p>
					<p className="mt-3 text-theme-secondary-600" data-testid="plugin-info__permissions">
						{permissions.join(", ")}
					</p>
				</div>
			) : null}

			{hasRequirements ? (
				<div className="mt-8">
					<p className="font-bold">{t("PLUGINS.PLUGIN_INFO.REQUIREMENTS")}</p>
					{minimumVersion && (
						<p className="mt-3 text-theme-secondary-600" data-testid="plugin-info__mininum-version">
							<span>
								{t("PLUGINS.PLUGIN_INFO.DESKTOP_WALLET_VERSION")} v{minimumVersion}+
							</span>
						</p>
					)}
				</div>
			) : null}

			{images.length ? (
				<div className="relative mt-8">
					<p className="font-bold">{t("PLUGINS.PLUGIN_INFO.SCREENSHOTS")}</p>
					<div
						className="flex absolute top-0 right-0 pr-4 space-x-3 screenshots-pagination"
						data-testid="plugin-info__screenshots--pagination"
					/>
					<div className="mt-4">
						<Slider
							data={images}
							options={{
								pagination: {
									el: ".screenshots-pagination",
									clickable: true,
								},
								slideHeight: 200,
								slidesPerView: 3,
								slidesPerColumn: 1,
								slidesPerGroup: 3,
								spaceBetween: 20,
							}}
						>
							{(screenshot: any) => (
								<img
									src={screenshot}
									data-testid="plugin-info__screenshot"
									className="object-contain overflow-hidden w-full max-h-44 rounded-lg bg-theme-secondary-200"
									alt="Screenshot"
								/>
							)}
						</Slider>
					</div>
				</div>
			) : null}

			<div className="mt-8">
				<Alert variant="warning" title={t("COMMON.DISCLAIMER")}>
					The availability of this plugin in the ARK Desktop Wallet does not mean that either ARK.io or ARK
					SCIC is directly involved in the development or affiliated with the developer providing this plugin.
					By installing it on your wallet, you assume every responsibility
				</Alert>
			</div>
		</>
	);
};

PluginInfo.defaultProps = {
	permissions: [],
	images: [],
};
