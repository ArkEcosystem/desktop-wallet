import { Alert } from "app/components/Alert";
import { Button } from "app/components/Button";
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
import { useProfileImport } from "domains/profile/hooks/use-profile-import";
import path from "path";
import React from "react";
import { useTranslation } from "react-i18next";

import { ImportFile } from "./models";

type SelectFileStepProps = {
	fileFormat: string;
	onFileFormatChange?: (fileFormat: string) => void;
	onFileSelected?: (file: ImportFile) => void;
	onBack?: () => void;
};

export const SelectFileStep = ({ onBack, onFileSelected, onFileFormatChange, fileFormat }: SelectFileStepProps) => {
	const { t } = useTranslation();
	const { openFileToImport, readFile } = useProfileImport();

	const handleBrowseFiles = async () => {
		const file = await openFileToImport({ extensions: [fileFormat.replace(/\./g, "")] });

		if (!file) {
			return;
		}

		onFileSelected?.(file);
	};

	const handleFileDrop = (event: any) => {
		event.preventDefault();
		event.stopPropagation();

		const firstAcceptedFileByExtension = [...event.dataTransfer.files].find(({ name }) => path.extname(name) === fileFormat);

		if (!firstAcceptedFileByExtension) {
			return;
		}

		const file = readFile(firstAcceptedFileByExtension.path);
		onFileSelected?.(file);
	};

	const handleBack = () => {
		if (fileFormat === ".json") {
			return onFileFormatChange?.(".dwe");
		}

		onBack?.();
	};

	return (
		<div className="mx-auto max-w-xl">
			<Header
				title={t("PROFILE.IMPORT.TITLE")}
				subtitle={t("PROFILE.IMPORT.SELECT_FILE_STEP.DESCRIPTION", { fileFormat })}
			/>
			<div
				onDragOver={(event: any) => event.preventDefault()}
				onDragEnter={(event: any) => event.preventDefault()}
				onDrop={handleFileDrop}
				className="h-52 border-2 border-dashed rounded-lg mt-8 border-theme-secondary-300 dark:border-theme-secondary-800 flex flex-col items-center justify-center"
			>
				{fileFormat === ".dwe" && <Icon name="File" width={40} height={40} />}
				{fileFormat === ".json" && <Icon name="File" width={40} height={40} />}

				<div className="mt-8">
					<span className="font-semibold">{t("PROFILE.IMPORT.SELECT_FILE_STEP.DRAG_AND_DROP")} </span>
					<span
						onClick={handleBrowseFiles}
						title={t("PROFILE.IMPORT.SELECT_FILE_STEP.UPLOAD_TITLE")}
						data-testid="PluginManager__home__featured__view-more"
						className="font-semibold cursor-pointer link"
					>
						{t("PROFILE.IMPORT.SELECT_FILE_STEP.BROWSE_FILES")}
					</span>
				</div>
				<div className="font-semibold text-theme-secondary-500 text-sm mt-2">
					{t("PROFILE.IMPORT.SELECT_FILE_STEP.SUPPORTED_FORMAT", { fileFormat })}
				</div>
			</div>

			{fileFormat === ".dwe" && (
				<p className="text-sm text-theme-secondary-text md:text-base mt-6 text-center">
					<span>{t("PROFILE.IMPORT.SELECT_FILE_STEP.LEGACY_IMPORT")} </span>
					<span
						onClick={() => onFileFormatChange?.(".json")}
						title={t("PROFILE.IMPORT.SELECT_FILE_STEP.CLICK_HERE")}
						data-testid="PluginManager__home__featured__view-more"
						className="font-semibold cursor-pointer link"
					>
						{t("PROFILE.IMPORT.SELECT_FILE_STEP.CLICK_HERE")}
					</span>
				</p>
			)}

			{fileFormat === ".json" && (
				<div className="mt-6">
					<Alert>{t("PROFILE.IMPORT.SELECT_FILE_STEP.DEPRECATION_WARNING")}</Alert>
				</div>
			)}

			<div className="flex justify-end mt-8 space-x-3">
				<Button data-testid="SendTransfer__button--back" variant="secondary" onClick={handleBack}>
					{t("COMMON.BACK")}
				</Button>
			</div>
		</div>
	);
};
