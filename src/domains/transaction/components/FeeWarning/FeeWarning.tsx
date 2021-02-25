import { Button } from "app/components/Button";
import { Checkbox } from "app/components/Checkbox";
import { FormField } from "app/components/Form";
import { Image } from "app/components/Image";
import { Modal } from "app/components/Modal";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export enum FeeWarningVariant {
	Low = "LOW",
	High = "HIGH",
}

type FeeWarningProps = {
	isOpen: boolean;
	variant?: FeeWarningVariant;
	onCancel: (suppressWarning: boolean) => Promise<void>;
	onConfirm: (suppressWarning: boolean) => Promise<void>;
};

export const FeeWarning = ({ isOpen, variant, onCancel, onConfirm }: FeeWarningProps) => {
	const { t } = useTranslation();

	const { setValue, watch } = useFormContext();

	const { suppressWarning } = watch();

	return (
		<Modal
			isOpen={isOpen}
			title={t("TRANSACTION.MODAL_FEE_WARNING.TITLE")}
			image={<Image name="WarningBanner" className="my-8 mx-auto" />}
			size="lg"
			onClose={onCancel}
		>
			<div className="mt-8 mb-6 text-theme-secondary-text">
				{t(`TRANSACTION.MODAL_FEE_WARNING.DESCRIPTION.TOO_${variant}`)}
			</div>

			<FormField name="suppressWarning">
				<label className="flex items-center space-x-2">
					<Checkbox
						name="suppressWarning"
						data-testid="FeeWarning__suppressWarning-toggle"
						onChange={() => setValue("suppressWarning", !suppressWarning)}
					/>
					<span className="text-sm text-theme-secondary-500 dark:text-theme-secondary-700">
						{t("TRANSACTION.MODAL_FEE_WARNING.DO_NOT_WARN")}
					</span>
				</label>
			</FormField>

			<div className="flex justify-end mt-8 space-x-3">
				<Button
					variant="secondary"
					onClick={() => onCancel(suppressWarning)}
					data-testid="FeeWarning__cancel-button"
				>
					{t("COMMON.CANCEL")}
				</Button>

				<Button data-testid="FeeWarning__continue-button" onClick={() => onConfirm(suppressWarning)}>
					{t("COMMON.CONTINUE")}
				</Button>
			</div>
		</Modal>
	);
};
