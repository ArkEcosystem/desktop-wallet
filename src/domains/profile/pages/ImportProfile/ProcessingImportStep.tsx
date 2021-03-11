import { Environment, Profile } from "@arkecosystem/platform-sdk-profiles";
import { Header } from "app/components/Header";
import { FilePreview } from "domains/profile/components/FilePreview";
import { useProfileImport } from "domains/profile/hooks/use-profile-import";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { ImportFile } from "./models";

type ProcessingImportProps = {
	env: Environment;
	file: ImportFile;
	password?: string;
	onSuccess?: (profile: any) => void;
	onPasswordRequired?: () => void;
	onError?: (message: string) => void;
};

export const ProcessingImport = ({
	file,
	env,
	onError,
	onPasswordRequired,
	password,
	onSuccess,
}: ProcessingImportProps) => {
	const { t } = useTranslation();
	const { importProfile } = useProfileImport();

	useEffect(() => {
		const runImport = async () => {
			let profile: Profile | undefined;
			console.log("running profile import", password);

			try {
				profile = await importProfile({ env, file, password });
				console.log("profile", profile);
				onSuccess?.(profile);
			} catch (error) {
				if (error.message === "PasswordRequired") {
					return onPasswordRequired?.();
				}

				onError?.(error.message);
			}
		};

		if (file) {
			runImport();
		}
	}, [file, password]);

	return (
		<div className="mx-auto max-w-xl">
			<Header
				title={t("PROFILE.IMPORT.TITLE")}
				subtitle={t("PROFILE.IMPORT.PROCESSING_IMPORT_STEP.DESCRIPTION", { name: file.name })}
			/>
			<div className="text-theme-secondary-text">{t("PROFILE.IMPORT.PROCESSING_IMPORT_STEP.PLEASE_WAIT")}</div>

			<div className="mt-8">
				<FilePreview file={file} variant="loading" />
			</div>
		</div>
	);
};
