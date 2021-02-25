import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import React from "react";
import { useTranslation } from "react-i18next";
const { ErrorBanner } = images.common;

type ErroStepProps = {
	title?: string;
	subtitle?: string;
	isRepeatDisabled?: boolean;
	onBack?: () => void;
	onRepeat?: () => void;
};

export const ErrorStep = ({ title, subtitle, onBack, onRepeat, isRepeatDisabled = false }: ErroStepProps) => {
	const { t } = useTranslation();
	return (
		<div data-testid="ErrorStep">
			<div>
				<h1 className="mb-8 text-lg font-bold md:text-4xl">{title || t("TRANSACTION.ERROR.TITLE")}</h1>
				<div className="my-4 mx-auto w-128">
					<ErrorBanner />
				</div>
				<div className="my-8 text-md text-theme-secondary-text">
					{subtitle || t("TRANSACTION.ERROR.SUBTITLE")}
				</div>
			</div>

			<div className="flex justify-end space-x-3">
				<Button onClick={() => onBack?.()} data-testid="ErrorStep__wallet-button" variant="secondary">
					{t("COMMON.BACK_TO_WALLET")}
				</Button>

				<Button
					data-testid="ErrorStep__repeat-button"
					disabled={isRepeatDisabled}
					className="space-x-2"
					onClick={() => onRepeat?.()}
				>
					{t("COMMON.RETRY")}
				</Button>
			</div>
		</div>
	);
};
