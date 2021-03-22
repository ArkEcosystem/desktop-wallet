import { Icon } from "app/components/Icon";
import { Spinner } from "app/components/Spinner";
import { TruncateMiddle } from "app/components/TruncateMiddle";
import { ImportFile } from "domains/profile/pages/ImportProfile/models";
import React from "react";

type FilePreviewVariant = "success" | "loading" | "danger";

type FilePreviewProps = {
	file?: ImportFile;
	variant?: FilePreviewVariant;
	useBorders?: boolean;
};

export const FilePreviewPlain = ({ file, variant }: { file: ImportFile; variant?: FilePreviewVariant }) => {
	const fileTypeIcon: Record<string, string> = {
		".dwe": "DweFile",
		".json": "JsonFile",
	};

	return (
		<div className="flex items-center justify-between space-x-4">
			<div className="flex space-x-4 items-center">
				<Icon name={fileTypeIcon[file.extension] || "File"} width={40} height={40} />
				<div className="font-semibold">
					<TruncateMiddle text={file.name} maxChars={40} />
				</div>
			</div>

			{variant === "loading" && <Spinner size="md" />}

			{variant === "danger" && (
				<div className="rounded-full text-theme-danger-500 bg-theme-danger-200 w-6 h-6 flex justify-center items-center">
					<Icon name="Close" width={10} />
				</div>
			)}

			{variant === "success" && (
				<div className="rounded-full text-theme-success-500 bg-theme-success-200 w-6 h-6 flex justify-center items-center">
					<Icon name="Checkmark" width={16} />
				</div>
			)}
		</div>
	);
};

export const FilePreview = ({ file, useBorders = true, variant }: FilePreviewProps) => {
	if (!file) {
		return <></>;
	}

	if (!useBorders) {
		return <FilePreviewPlain variant={variant} file={file} />;
	}

	return (
		<div className="p-4 border-2 rounded-lg border-theme-secondary-200 dark:border-theme-secondary-800">
			<FilePreviewPlain variant={variant} file={file} />
		</div>
	);
};
