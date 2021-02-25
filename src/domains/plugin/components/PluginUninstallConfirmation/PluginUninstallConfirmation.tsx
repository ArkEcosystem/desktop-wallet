import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { Image } from "app/components/Image";
import { Modal } from "app/components/Modal";
import { useEnvironmentContext } from "app/contexts";
import { PluginController, usePluginManagerContext } from "plugins";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
	isOpen: boolean;
	profile: Profile;
	plugin: PluginController;
	onClose?: () => void;
	onDelete?: () => void;
};

export const PluginUninstallConfirmation = ({ isOpen, profile, plugin, onClose, onDelete }: Props) => {
	const { t } = useTranslation();

	const { persist } = useEnvironmentContext();
	const { deletePlugin } = usePluginManagerContext();

	const handleDelete = async () => {
		await deletePlugin(plugin, profile);
		await persist();
		onDelete?.();
	};

	return (
		<Modal
			title={t("PLUGINS.MODAL_UNINSTALL.TITLE")}
			image={<Image name="DeleteBanner" className="w-3/5 m-auto my-8" />}
			description={t("PLUGINS.MODAL_UNINSTALL.DESCRIPTION", { name: plugin.config().title() })}
			size="lg"
			isOpen={isOpen}
			onClose={onClose}
		>
			<div data-testid="PluginUninstallConfirmation">
				<div className="flex justify-end mt-8 space-x-3">
					<Button variant="secondary" onClick={onClose} data-testid="PluginUninstall__cancel-button">
						{t("COMMON.CANCEL")}
					</Button>

					<Button
						type="submit"
						onClick={handleDelete}
						variant="danger"
						data-testid="PluginUninstall__submit-button"
					>
						<Icon name="Trash" />
						<span>{t("COMMON.DELETE")}</span>
					</Button>
				</div>
			</div>
		</Modal>
	);
};

PluginUninstallConfirmation.defaultProps = {
	isOpen: false,
};
