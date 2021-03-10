import { Alert } from "app/components/Alert";
import { Button } from "app/components/Button";
import { FormField, FormLabel } from "app/components/Form";
import { Input, InputGroup } from "app/components/Input";
import { Modal } from "app/components/Modal";
import { toasts } from "app/services";
import { githubProvider } from "domains/transaction/entity/providers";
import { usePluginManagerContext } from "plugins";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
	isOpen: boolean;
	onClose?: () => void;
	onSuccess?: (result: { pluginId: string; repositoryURL: string }) => void;
};

export const PluginManualInstallModal = ({ isOpen, onClose, onSuccess }: Props) => {
	const { t } = useTranslation();

	const { fetchLatestPackageConfiguration } = usePluginManagerContext();
	const [url, setUrl] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isInvalid, setIsInvalid] = useState(false);

	const handleInstall = async () => {
		setIsLoading(true);
		try {
			const pluginId = await fetchLatestPackageConfiguration(url);
			onSuccess?.({ pluginId, repositoryURL: url });
		} catch {
			toasts.error("Failed to find a valid plugin repository. Please verify the URL and try again.");
		}
		setIsLoading(false);
	};

	useEffect(() => {
		if (url) {
			setIsInvalid(!githubProvider.validate(url));
		}
	}, [url]);

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

				<FormField name="url" className="mt-8">
					<FormLabel>{t("PLUGINS.MODAL_MANUAL_INSTALL_PLUGIN.PLACEHOLDER")}</FormLabel>
					<InputGroup>
						<Input
							data-testid="PluginManualInstallModal__input"
							value={url}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
							isInvalid={isInvalid}
						/>
					</InputGroup>
				</FormField>

				<div className="flex space-x-3 justify-end mt-8">
					<Button variant="secondary" onClick={onClose} data-testid="PluginManualInstallModal__cancel-button">
						{t("COMMON.CANCEL")}
					</Button>

					<Button
						type="submit"
						onClick={handleInstall}
						data-testid="PluginManualInstallModal__submit-button"
						disabled={!url || isInvalid}
						isLoading={isLoading}
					>
						<span>{t("COMMON.CONFIRM")}</span>
					</Button>
				</div>
			</div>
		</Modal>
	);
};

PluginManualInstallModal.defaultProps = {
	isOpen: false,
};
