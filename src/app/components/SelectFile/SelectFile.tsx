import { Icon } from "app/components/Icon";
import { ReadableFile, useFiles } from "app/hooks/use-files";
import cn from "classnames";
import path from "path";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type SelectFileStepProps = {
	fileFormat: string;
	onSelect?: (file: ReadableFile) => void;
};

export const SelectFile = ({ onSelect, fileFormat }: SelectFileStepProps) => {
	const { t } = useTranslation();

	const [isDragging, setIsDragging] = useState(false);
	const { openFile, readFileContents } = useFiles();

	const ref: any = useRef(null);

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

		setIsDragging(false);

		onSelect?.(file);
	};

	const fileFormatIcon: Record<string, string> = {
		".dwe": "DweFile",
		".json": "JsonFile",
	};

	return (
		<div
			data-testid="SelectFile"
			className="h-52 border-2 border-dashed rounded-lg mt-8 border-theme-secondary-300 dark:border-theme-secondary-800 p-2"
		>
			<div
				data-testid="SelectFile__drop-zone"
				ref={ref}
				onDragOver={(event: any) => event.preventDefault()}
				onDragEnter={(event: any) => {
					event.preventDefault();
					setIsDragging(true);
				}}
				onDragLeave={(event: any) => {
					event.preventDefault();

					const bounds = ref.current?.getBoundingClientRect();

					/* istanbul ignore next */
					if (
						event.clientX >= Number(bounds.left) + Number(bounds.width) ||
						event.clientX <= bounds.left ||
						event.clientY >= Number(bounds.top) + Number(bounds.height) ||
						event.clientY <= bounds.top
					) {
						setIsDragging(false);
					}
				}}
				onDrop={handleFileDrop}
				className={cn(
					"h-full flex flex-col items-center justify-center rounded-lg transition-colors duration-200",
					{
						"bg-theme-primary-100 dark:bg-black": isDragging,
						"bg-theme-primary-50 dark:bg-theme-secondary-800": !isDragging,
					},
				)}
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
		</div>
	);
};
