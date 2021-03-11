import { Button } from "app/components/Button";
import { Header } from "app/components/Header";
import { FilePreview } from "domains/profile/components/FilePreview";
import React from "react";
import { useTranslation } from "react-i18next";

import { ImportFile } from "./models";

type ImportErrorProps = {
	file: ImportFile;
	error: string;
	onRetry?: () => void;
	onBack?: () => void;
};

export const ImportError = ({ file, error, onBack, onRetry }: ImportErrorProps) => {
	const { t } = useTranslation();

	return (
		<div className="mx-auto max-w-xl">
			<Header title={t("PROFILE.IMPORT.TITLE")} subtitle={t("PROFILE.IMPORT.ERROR_STEP.DESCRIPTION")} />

			<div className="mt-8">
				<FilePreview file={file} variant="danger" />
			</div>

			<div className="flex justify-end mt-8 space-x-3">
				<Button data-testid="SendTransfer__button--back" variant="secondary" onClick={onBack}>
					{t("COMMON.BACK_TO_HOME")}
				</Button>
				<Button data-testid="--back" onClick={onRetry}>
					{t("COMMON.RETRY")}
				</Button>
			</div>
		</div>
	);
};
