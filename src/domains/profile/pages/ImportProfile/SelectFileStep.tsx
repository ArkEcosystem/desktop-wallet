import { Alert } from "app/components/Alert";
import { Button } from "app/components/Button";
import { Header } from "app/components/Header";
import { SelectFile } from "app/components/SelectFile";
import { ReadableFile } from "app/hooks/use-files";
import React from "react";
import { useTranslation } from "react-i18next";

type SelectFileStepProps = {
	fileFormat: string;
	onFileFormatChange?: (fileFormat: string) => void;
	onSelect?: (file: ReadableFile) => void;
	onBack?: () => void;
};

export const SelectFileStep = ({ onBack, onSelect, onFileFormatChange, fileFormat }: SelectFileStepProps) => {
	const { t } = useTranslation();

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

			<SelectFile fileFormat={fileFormat} onSelect={onSelect} />

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
