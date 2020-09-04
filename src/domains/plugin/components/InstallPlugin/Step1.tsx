import React from "react";
import { useTranslation } from "react-i18next";

export const FirstStep = () => {
	const { t } = useTranslation();

	return (
		<section data-testid="InstallPlugin__step--first">
			<p className="mt-4 text-lg font-semibold text-theme-neutral-dark">
				{t("PLUGINS.MODAL_INSTALL_PLUGIN.DESCRIPTION")}
			</p>
			<div className="max-w-sm">
				<ul className="mt-2 ml-5 list-outside leading-8 list-circle text-theme-neutral-dark">
					<li>{t("PLUGINS.MODAL_INSTALL_PLUGIN.ITEM_1")}</li>
					<li>{t("PLUGINS.MODAL_INSTALL_PLUGIN.ITEM_2")}</li>
					<li>{t("PLUGINS.MODAL_INSTALL_PLUGIN.ITEM_3")}</li>
				</ul>
			</div>
		</section>
	);
};
