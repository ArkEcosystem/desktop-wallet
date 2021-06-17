import { Alert } from "app/components/Alert";
import { Button } from "app/components/Button";
import { Form, FormField, FormLabel } from "app/components/Form";
import { Input } from "app/components/Input";
import { Modal } from "app/components/Modal";
import { toasts } from "app/services";
import { usePluginManagerContext } from "plugins";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface Properties {
	isOpen: boolean;
	onClose?: () => void;
	onSuccess: (result: { pluginId: string; repositoryURL: string }) => void;
}

export const PluginManualInstallModal = ({ isOpen, onClose, onSuccess }: Properties) => {
	const { t } = useTranslation();

	const [isLoading, setIsLoading] = useState(false);

	const form = useForm({ mode: "onChange" });

	const { getValues, register, formState } = form;
	const { isValid, isSubmitting } = formState;

	const { fetchLatestPackageConfiguration } = usePluginManagerContext();

	const handleInstall = async () => {
		setIsLoading(true);

		const url = getValues("url");

		try {
			const pluginId = await fetchLatestPackageConfiguration(url);
			onSuccess({ pluginId, repositoryURL: url });
		} catch {
			toasts.error("Failed to find a valid plugin repository. Please verify the URL and try again.");
		}

		setIsLoading(false);
	};

	return (
		<Modal
			title={t("PLUGINS.MODAL_MANUAL_INSTALL_PLUGIN.TITLE")}
			description={t("PLUGINS.MODAL_MANUAL_INSTALL_PLUGIN.DESCRIPTION")}
			size="xl"
			isOpen={isOpen}
			onClose={onClose}
		>
			<div data-testid="PluginManualInstallModal">
				<div className="flex mt-8">
					<Alert variant="warning">
						<span className="text-sm">{t("PLUGINS.WARNING_DISCLAIMER")}</span>
					</Alert>
				</div>

				<Form context={form} onSubmit={handleInstall}>
					<FormField name="url" className="flex flex-col mt-6 space-y-2">
						<FormLabel>{t("PLUGINS.MODAL_MANUAL_INSTALL_PLUGIN.REPOSITORY_URL")}</FormLabel>
						<Input
							data-testid="PluginManualInstallModal__input"
							ref={register({
								required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
									field: t("PLUGINS.MODAL_MANUAL_INSTALL_PLUGIN.REPOSITORY_URL"),
								}).toString(),
								validate: (value) => {
									const regex = /https?:\/\/(?:www\.)?github\.com\/([\w.-]+)(?:\/[\dA-z-]+)?\/?/;

									if (!regex.test(value)) {
										return t("COMMON.VALIDATION.FIELD_INVALID", {
											field: t("PLUGINS.MODAL_MANUAL_INSTALL_PLUGIN.REPOSITORY_URL"),
										}).toString();
									}

									return true;
								},
							})}
						/>
					</FormField>

					<div className="flex justify-end mt-8 space-x-3">
						<Button
							variant="secondary"
							onClick={onClose}
							data-testid="PluginManualInstallModal__cancel-button"
						>
							{t("COMMON.CANCEL")}
						</Button>

						<Button
							type="submit"
							data-testid="PluginManualInstallModal__submit-button"
							disabled={!isValid || isSubmitting}
							isLoading={isLoading}
						>
							<span>{t("COMMON.CONFIRM")}</span>
						</Button>
					</div>
				</Form>
			</div>
		</Modal>
	);
};

PluginManualInstallModal.defaultProps = {
	isOpen: false,
};
