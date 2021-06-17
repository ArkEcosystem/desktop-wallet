import { Icon } from "app/components/Icon";
import { ReadableFile, useFiles } from "app/hooks/use-files";
import cn from "classnames";
import path from "path";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface SelectFileStepProperties {
	fileFormat: string;
	onSelect?: (file: ReadableFile) => void;
}

export const SelectFile = ({ onSelect, fileFormat }: SelectFileStepProperties) => {
	const { t } = useTranslation();

	const [isDragging, setIsDragging] = useState(false);
	const { openFile, readFileContents } = useFiles();

	const reference: any = useRef(null);

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

		setIsDragging(false);

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
			className="p-2 mt-8 h-52 rounded-lg border-2 border-dashed border-theme-secondary-300 dark:border-theme-secondary-800"
		>
			<div
				data-testid="SelectFile__drop-zone"
				ref={reference}
				onDragOver={(event: any) => event.preventDefault()}
				onDragEnter={(event: any) => {
					event.preventDefault();
					setIsDragging(true);
				}}
				onDragLeave={(event: any) => {
					event.preventDefault();

					const bounds = reference.current?.getBoundingClientRect();

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

				<div className="mt-8 space-x-px">
					<span className="font-semibold">{t("PROFILE.IMPORT.SELECT_FILE_STEP.DRAG_AND_DROP")} </span>
					<button
						type="button"
						onClick={handleBrowseFiles}
						title={t("PROFILE.IMPORT.SELECT_FILE_STEP.UPLOAD_TITLE")}
						data-testid="SelectFile__browse-files"
						className="relative font-semibold cursor-pointer focus:outline-none link group"
					>
						{/* border on focus */}
						<div className="absolute inset-0 -m-1 rounded group-focus-visible group-focus:ring-2 ring-theme-primary-400" />

						{t("PROFILE.IMPORT.SELECT_FILE_STEP.BROWSE_FILES")}
					</button>
				</div>
				<div className="mt-2 text-sm font-semibold text-theme-secondary-500">
					{t("PROFILE.IMPORT.SELECT_FILE_STEP.SUPPORTED_FORMAT", { fileFormat })}
				</div>
			</div>
		</div>
	);
};
