import { Button } from "app/components/Button";
import { Form, FormField, FormLabel } from "app/components/Form";
import { InputPassword } from "app/components/Input";
import { Modal } from "app/components/Modal";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type PasswordModalProps = {
	title: string;
	description: string;
	isOpen: boolean;
	onCancel?: any;
	onClose?: any;
	onSubmit?: (password: string) => void;
};

export const PasswordModal = ({ isOpen, title, description, onCancel, onClose, onSubmit }: PasswordModalProps) => {
	const { t } = useTranslation();
	const form = useForm({ mode: "onChange" });
	const { password } = form.watch();

	return (
		<Modal
			title={title}
			titleClass="items-left"
			description={description}
			size="md"
			isOpen={isOpen}
			onClose={onClose}
		>
			<Form context={form} onSubmit={() => onSubmit?.(password)} className="mt-8">
				<FormField name="password">
					<FormLabel label={t("SETTINGS.GENERAL.PERSONAL.PASSWORD")} required />
					<InputPassword
						ref={form.register({
							required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
								field: t("COMMON.PASSWORD"),
							}).toString(),
						})}
						data-testid="PasswordModal__input"
					/>
				</FormField>

				<div className="flex justify-end mt-8 space-x-3">
					<Button data-testid="PasswordModal__cancel-button" variant="secondary" onClick={onCancel}>
						{t("COMMON.CANCEL")}
					</Button>

					<Button data-testid="PasswordModal__submit-button" type="submit" disabled={!form.formState.isValid}>
						{t("COMMON.SUBMIT")}
					</Button>
				</div>
			</Form>
		</Modal>
	);
};
