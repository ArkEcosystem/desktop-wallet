import { Alert } from "app/components/Alert";
import { Button } from "app/components/Button";
import { Input } from "app/components/Input";
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
			size="lg"
			isOpen={isOpen}
			onClose={onClose}
		>
			<div data-testid="PluginManualInstallModal">
				<div className="flex justify-center mt-8">
					<Input
						data-testid="PluginManualInstallModal__input"
						placeholder={t("PLUGINS.MODAL_MANUAL_INSTALL_PLUGIN.PLACEHOLDER")}
						value={url}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
						isInvalid={isInvalid}
					/>
				</div>

				<div className="flex justify-center my-8">
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

				<Alert size="sm" variant="warning" title={t("COMMON.DISCLAIMER")}>
					{t("PLUGINS.WARNING_DISCLAIMER")}
				</Alert>
			</div>
		</Modal>
	);
};

PluginManualInstallModal.defaultProps = {
	isOpen: false,
};
