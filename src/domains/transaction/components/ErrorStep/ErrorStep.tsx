import { Button } from "app/components/Button";
import { Clipboard } from "app/components/Clipboard";
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
import { Image } from "app/components/Image";
import { TextArea } from "app/components/TextArea";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";

interface Properties {
	title?: string;
	isRepeatDisabled?: boolean;
	onBack?: () => void;
	onRepeat?: () => void;
	errorMessage?: string;
}

export const ErrorStep = ({ title, onBack, onRepeat, isRepeatDisabled = false, errorMessage }: Properties) => {
	const { t } = useTranslation();
	const errorMessageReference = useRef();

	return (
		<div data-testid="ErrorStep" className="space-y-8">
			<Header title={title || t("TRANSACTION.ERROR.TITLE")} />

			<Image name="TransactionErrorBanner" domain="transaction" className="w-full" />

			<div className="space-y-6">
				<p className="text-theme-secondary-text">{t("TRANSACTION.ERROR.DESCRIPTION")}</p>

				{errorMessage && (
					<TextArea
						data-testid="ErrorStep__errorMessage"
						className="py-4"
						initialHeight={70}
						defaultValue={errorMessage}
						ref={errorMessageReference}
						disabled
					/>
				)}
			</div>

			<div className="flex">
				{errorMessage && (
					<Clipboard variant="button" data={errorMessage}>
						<Icon name="Copy" />
						<span>{t("COMMON.COPY")}</span>
					</Clipboard>
				)}

				<Button
					className="ml-auto mr-3"
					onClick={() => onBack?.()}
					data-testid="ErrorStep__wallet-button"
					variant="secondary"
				>
					{t("COMMON.BACK_TO_WALLET")}
				</Button>

				<Button data-testid="ErrorStep__repeat-button" disabled={isRepeatDisabled} onClick={() => onRepeat?.()}>
					{t("COMMON.RETRY")}
				</Button>
			</div>
		</div>
	);
};
