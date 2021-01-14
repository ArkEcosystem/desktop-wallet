import { Alert } from "app/components/Alert";
import { Slider } from "app/components/Slider";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
	about: string;
	permissions: any;
	screenshots: any;
};

export const PluginInfo = ({ about, permissions, screenshots }: Props) => {
	const { t } = useTranslation();

	return (
		<>
			<div>
				<p className="font-bold">{t("PLUGINS.PLUGIN_INFO.ABOUT")}</p>
				<p className="mt-3 text-theme-secondary-600" data-testid="plugin-info__about">
					{about}
				</p>
			</div>

			<div className="mt-8">
				<p className="font-bold">{t("PLUGINS.PLUGIN_INFO.PERMISSIONS")}</p>
				<p className="mt-3 text-theme-secondary-600" data-testid="plugin-info__permissions">
					{permissions.join(", ")}
				</p>
			</div>

			<div className="relative mt-8">
				<p className="font-bold">{t("PLUGINS.PLUGIN_INFO.SCREENSHOTS")}</p>
				<div
					className="flex absolute top-0 right-0 pr-4 space-x-3 screenshots-pagination"
					data-testid="plugin-info__screenshots--pagination"
				/>
				<div className="pb-8">
					<Slider
						data={[screenshots, screenshots, screenshots]}
						options={{
							pagination: {
								el: ".screenshots-pagination",
								clickable: true,
							},
						}}
					>
						{(screenshotGroup: any) => (
							<div className="flex pb-10 mt-3 mr-3 space-x-4">
								{screenshotGroup.map((screenshot: any, idx: number) => (
									<div
										data-testid="plugin-info__screenshot"
										key={idx}
										className="w-1/3 h-56 rounded-lg bg-theme-secondary-500"
									/>
								))}
							</div>
						)}
					</Slider>
				</div>

				<Alert variant="warning" title={t("COMMON.DISCLAIMER")}>
					The availability of this plugin in the ARK Desktop Wallet does not mean that either ARK.io or ARK
					SCIC is directly involved in the development or affiliated with the developer providing this plugin.
					By installing it on your wallet, you assume every responsibility
				</Alert>
			</div>
		</>
	);
};
