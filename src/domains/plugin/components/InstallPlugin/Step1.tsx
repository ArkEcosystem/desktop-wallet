import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
	plugin: any;
};

export const FirstStep = ({ plugin }: Props) => {
	const { t, i18n } = useTranslation();
	const validPermissions = plugin.permissions.filter((permission: string) =>
		i18n.exists(`PLUGINS.PERMISSIONS.${permission}`),
	);

	return (
		<section data-testid="InstallPlugin__step--first">
			<p className="mt-4 text-lg font-semibold text-theme-secondary-text">
				{t("PLUGINS.MODAL_INSTALL_PLUGIN.DESCRIPTION")}
			</p>
			<div className="max-w-sm">
				<ul className="mt-2 ml-5 leading-8 list-outside list-circle text-theme-secondary-text">
					{validPermissions.map((permission: string) => (
						<li key={permission}>{t(`PLUGINS.PERMISSIONS.${permission}`)}</li>
					))}
				</ul>
			</div>
		</section>
	);
};
