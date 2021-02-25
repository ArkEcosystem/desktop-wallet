import { Button } from "app/components/Button";
import { Header } from "app/components/Header";
import { Image } from "app/components/Image";
import React from "react";
import { useTranslation } from "react-i18next";

type ErroStepProps = {
	title?: string;
	description?: string;
	isRepeatDisabled?: boolean;
	onBack?: () => void;
	onRepeat?: () => void;
};

export const ErrorStep = ({ title, description, onBack, onRepeat, isRepeatDisabled = false }: ErroStepProps) => {
	const { t } = useTranslation();

	return (
		<div data-testid="ErrorStep" className="space-y-8">
			<Header title={title || t("TRANSACTION.ERROR.TITLE")} />

			<Image name="TransactionErrorBanner" domain="transaction" className="w-full" />

			<p className="text-theme-secondary-text">{t("TRANSACTION.ERROR.DESCRIPTION")}</p>

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
