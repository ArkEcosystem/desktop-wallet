import { Button } from "app/components/Button";
import { Modal } from "app/components/Modal";
import { TabPanel, Tabs } from "app/components/Tabs";
import { toasts } from "app/services";
import { usePluginManagerContext } from "plugins";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { FirstStep } from "./Step1";
import { SecondStep } from "./Step2";

type InstallPluginProps = {
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
	plugin?: any;
	repositoryURL?: string;
};

/* TODO: Show steps with download and installation progress*/
export const InstallPlugin = ({ isOpen, onClose, onCancel, plugin, repositoryURL }: InstallPluginProps) => {
	const { t } = useTranslation();
	const { downloadPlugin } = usePluginManagerContext();
	const [activeStep, setActiveStep] = useState(1);
	const [isDownloading, setIsDownloading] = useState(false);
	const [downloadProgress, setDownloadProgress] = useState<any>({});

	const handleDownload = useCallback(async () => {
		setIsDownloading(true);
		try {
			const savedPath = await downloadPlugin(plugin.id, repositoryURL);
			toasts.success(t("PLUGINS.MODAL_INSTALL_PLUGIN.SUCCESS", { name: plugin.title }));
		} catch {
			toasts.error(t("PLUGINS.MODAL_INSTALL_PLUGIN.FAILURE", { name: plugin.title }));
		} finally {
			setIsDownloading(false);
			onClose?.();
		}
	}, [downloadPlugin, plugin, onClose, repositoryURL, t]);

	return (
		<Modal
			title={t(activeStep === 1 ? "COMMON.ATTENTION" : "COMMON.DOWNLOADING")}
			size="lg"
			isOpen={isOpen}
			onClose={onClose}
		>
			<Tabs activeId={1}>
				<TabPanel tabId={1}>
					<FirstStep plugin={plugin} />
				</TabPanel>

				<TabPanel tabId={2}>
					<SecondStep plugin={plugin} downloadProgress={downloadProgress} />
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
