import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { toasts } from "app/services";
import { useProfileImport } from "domains/profile/hooks/use-profile-import";
import React from "react";
import { useTranslation } from "react-i18next";

export const ImportProfile = ({ env, persist }: { env: Environment; persist: Function }) => {
	const { t } = useTranslation();
	const { openFileToImport, importProfile } = useProfileImport({ env });

	const handleProfileImport = async () => {
		const { fileContent, fileExtension } = await openFileToImport();

		try {
			await importProfile({ fileContent, fileExtension });
			await persist();
		} catch (error) {
			toasts.error(error.message);
		}
	};

	return (
		<div>
			<p className="text-sm text-theme-secondary-text md:text-base mt-16">
				<span>{t("PROFILE.PAGE_WELCOME.HAS_EXPORTED_PROFILES")} </span>
				<span
					onClick={handleProfileImport}
					title={t("PROFILE.PAGE_WELCOME.IMPORT_PROFILE_TITLE")}
					data-testid="PluginManager__home__featured__view-more"
					className="font-semibold cursor-pointer link"
				>
					{t("PROFILE.PAGE_WELCOME.IMPORT_PROFILE")}
				</span>
			</p>
		</div>
	);
};
