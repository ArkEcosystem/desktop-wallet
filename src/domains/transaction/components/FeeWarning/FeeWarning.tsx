import { Button } from "app/components/Button";
import { Checkbox } from "app/components/Checkbox";
import { Form, FormField } from "app/components/Form";
import { Image } from "app/components/Image";
import { Modal } from "app/components/Modal";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type FeeWarningProps = {
	isOpen: boolean;
	onCancel: () => void;
	onConfirm: (doNotShowAgain: boolean) => void;
};

export const FeeWarning = ({ isOpen, onCancel, onConfirm }: FeeWarningProps) => {
	const { t } = useTranslation();

	const form = useForm({ mode: "onChange" });
	const { register } = form;

	const handleSubmit = ({ doNotShowAgain }: any) => {
		onConfirm(doNotShowAgain);
	};

	return (
		<Modal
			isOpen={isOpen}
			title={t("TRANSACTION.MODAL_FEE_WARNING.TITLE")}
			image={<Image name="WarningBanner" className="my-8 mx-auto" />}
			size="lg"
			onClose={onCancel}
		>
			<Form context={form} onSubmit={handleSubmit} className="mt-8">
				<div className="mt-8 mb-6 text-theme-secondary-text">
					{t("TRANSACTION.MODAL_FEE_WARNING.DESCRIPTION")}
				</div>

				<FormField name="doNotShowAgain">
					<label className="flex items-center space-x-2">
						<Checkbox
							ref={register()}
							name="doNotShowAgain"
							data-testid="FeeWarning__doNotShowAgain-toggle"
						/>
						<span className="text-sm text-theme-secondary-500 dark:text-theme-secondary-700">
							{t("COMMON.DONT_SHOW_AGAIN")}
						</span>
					</label>
				</FormField>

				<div className="flex justify-end mt-8 space-x-3">
					<Button variant="secondary" onClick={onCancel} data-testid="FeeWarning__cancel-button">
						{t("COMMON.CANCEL")}
					</Button>

					<Button type="submit" data-testid="FeeWarning__continue-button">
						{t("COMMON.CONTINUE")}
					</Button>
				</div>
			</Form>
		</Modal>
	);
};
