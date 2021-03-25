import { Alert } from "app/components/Alert";
import { Slider } from "app/components/Slider";
import { TruncateEnd } from "app/components/TruncateEnd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { PluginPermissionsModal } from "../PluginPermissionsModal/PluginPermissionsModal";

type Props = {
	description?: string;
	permissions?: any;
	images?: any;
	minimumVersion?: string;
};

export const PluginInfo = ({ description, permissions, images, minimumVersion }: Props) => {
	const { t, i18n } = useTranslation();
	const hasRequirements = !!minimumVersion;
	const [showPermissionsModal, setShowPermissionsModal] = useState(false);
	const translatedPermissions = permissions.map((permission: string) => {
		const key = `PLUGINS.PERMISSIONS.${permission}`;
		return i18n.exists(key) ? t(key) : permission;
	});
	const permissionsString = translatedPermissions.join(", ");

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
					<div className="mt-3 inline-flex items-baseline space-x-2">
						<p className="mt-3 text-theme-secondary-600" data-testid="plugin-info__permissions">
							<TruncateEnd maxChars={50} showTooltip={false} text={permissionsString} />
						</p>
						{permissionsString.length > 50 ? (
							<button
								data-testid="plugin-info__view-permissions"
								onClick={() => setShowPermissionsModal(true)}
								className="link"
							>
								{t("COMMON.VIEW_ALL")}
							</button>
						) : null}
					</div>
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
					{t("PLUGINS.PLUGIN_INFO.DISCLAIMER")}
				</Alert>
			</div>

			<PluginPermissionsModal
				permissions={translatedPermissions}
				isOpen={showPermissionsModal}
				onClose={() => setShowPermissionsModal(false)}
			/>
		</>
	);
};

PluginInfo.defaultProps = {
	permissions: [],
	images: [],
};
