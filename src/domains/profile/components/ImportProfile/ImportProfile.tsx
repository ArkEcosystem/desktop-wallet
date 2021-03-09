import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { toasts } from "app/services";
import { useProfileImport } from "domains/profile/hooks/use-profile-import";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { PasswordModal } from "../PasswordModal";

export const ImportProfile = ({ env, persist }: { env: Environment; persist: Function }) => {
	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

	const openedFile = useRef<{ fileContent?: string; fileExtension?: string }>({
		fileContent: undefined,
		fileExtension: undefined,
	});

	const { openFileToImport, importProfile } = useProfileImport({ env });
	const { t } = useTranslation();

	const handleProfileImport = async () => {
		const { fileContent, fileExtension } = await openFileToImport();
		runImport(fileContent, fileExtension);
	};

	const runImport = async (fileContent?: string, fileExtension?: string, password?: string) => {
		try {
			await importProfile({ fileContent, fileExtension, password });
			await persist();
		} catch (error) {
			if (error.message === "Is encrypted") {
				openedFile.current = { fileContent, fileExtension };
				setIsPasswordModalOpen(true);
				return;
			}

			toasts.error(error.message);
		}

		openedFile.current = {};
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

			<div className="text-left items-left">
				<PasswordModal
					isOpen={isPasswordModalOpen}
					title={t("PROFILE.IMPORT.PASSWORD_TITLE")}
					description={t("PROFILE.IMPORT.PASSWORD_DESCRIPTION")}
					onSubmit={(password) => {
						setIsPasswordModalOpen(false);
						runImport(openedFile.current.fileContent, openedFile.current.fileExtension, password);
					}}
					onCancel={() => setIsPasswordModalOpen(false)}
					onClose={() => setIsPasswordModalOpen(false)}
				/>
			</div>
		</div>
	);
};
