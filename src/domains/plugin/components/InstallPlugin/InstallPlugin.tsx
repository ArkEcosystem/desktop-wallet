import { Button } from "app/components/Button";
import { Modal } from "app/components/Modal";
import { TabPanel, Tabs } from "app/components/Tabs";
import { toasts } from "app/services";
import { usePluginManagerContext } from "plugins";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { FirstStep } from "./Step1";

type InstallPluginProps = {
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
	plugin?: any;
};

/* TODO: Show steps with download and installation progress*/
export const InstallPlugin = ({ isOpen, onClose, onCancel, plugin }: InstallPluginProps) => {
	const { t } = useTranslation();
	const { installPlugin } = usePluginManagerContext();

	const handleDownload = useCallback(async () => {
		try {
			await installPlugin(plugin.id);
			toasts.success(`The plugin "${plugin.title}" was successfully installed`);
		} catch {
			toasts.error(`Failed to install plugin "${plugin.title}"`);
		} finally {
			onClose?.();
		}
	}, [installPlugin, plugin, onClose]);

	return (
		<Modal title={t("COMMON.ATTENTION")} size="lg" isOpen={isOpen} onClose={onClose}>
			<Tabs activeId={1}>
				<TabPanel tabId={1}>
					<FirstStep plugin={plugin} />
				</TabPanel>

				<div className="flex justify-end mt-8 space-x-3">
					<>
						<Button variant="secondary" onClick={onCancel} data-testid="InstallPlugin__cancel-button">
							{t("COMMON.CANCEL")}
						</Button>
						<Button onClick={handleDownload} data-testid="InstallPlugin__download-button">
							{t("COMMON.DOWNLOAD")}
						</Button>
					</>
				</div>
			</Tabs>
		</Modal>
	);
};

InstallPlugin.defaultProps = {
	isOpen: false,
};
