import { Icon } from "app/components/Icon";
import { ReadableFile, useFiles } from "app/hooks/use-files";
import path from "path";
import React from "react";
import { useTranslation } from "react-i18next";

type SelectFileStepProps = {
	fileFormat: string;
	onSelect?: (file: ReadableFile) => void;
};

export const SelectFile = ({ onSelect, fileFormat }: SelectFileStepProps) => {
	const { t } = useTranslation();
	const { openFile, readFileContents } = useFiles();

	const handleBrowseFiles = async () => {
		const file = await openFile({ extensions: [fileFormat.replace(/\./g, "")] });

		/* istanbul ignore next */
		if (!file) {
			return;
		}

		onSelect?.(file);
	};

	const handleFileDrop = (event: any) => {
		event.preventDefault();
		event.stopPropagation();

		const firstAcceptedFileByExtension = [...event.dataTransfer.files].find(
			({ name }) => path.extname(name) === fileFormat,
		);

		if (!firstAcceptedFileByExtension) {
			return;
		}

		const file = readFileContents(firstAcceptedFileByExtension.path);
		onSelect?.(file);
	};

	const fileFormatIcon: Record<string, string> = {
		".dwe": "DweFile",
		".json": "JsonFile",
	};

	return (
		<div
			data-testid="SelectFile"
			onDragOver={(event: any) => event.preventDefault()}
			onDragEnter={(event: any) => event.preventDefault()}
			onDrop={handleFileDrop}
			className="h-52 border-2 border-dashed rounded-lg mt-8 border-theme-secondary-300 dark:border-theme-secondary-800 flex flex-col items-center justify-center"
		>
			{fileFormatIcon[fileFormat] && <Icon name={fileFormatIcon[fileFormat]} width={40} height={40} />}

			<div className="mt-8">
				<span className="font-semibold">{t("PROFILE.IMPORT.SELECT_FILE_STEP.DRAG_AND_DROP")} </span>
				<span
					onClick={handleBrowseFiles}
					title={t("PROFILE.IMPORT.SELECT_FILE_STEP.UPLOAD_TITLE")}
					data-testid="SelectFile__browse-files"
					className="font-semibold cursor-pointer link"
				>
					{t("PROFILE.IMPORT.SELECT_FILE_STEP.BROWSE_FILES")}
				</span>
			</div>
			<div className="font-semibold text-theme-secondary-500 text-sm mt-2">
				{t("PROFILE.IMPORT.SELECT_FILE_STEP.SUPPORTED_FORMAT", { fileFormat })}
			</div>
		</div>
	);
};
