import { Button } from "app/components/Button";
import { Modal } from "app/components/Modal";
import { TabPanel, Tabs } from "app/components/Tabs";
import { toasts } from "app/services";
import { ipcRenderer } from "electron";
import { usePluginManagerContext } from "plugins";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { FirstStep } from "./Step1";
import { SecondStep } from "./Step2";
import { ThirdStep } from "./Step3";

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
	const { downloadPlugin, installPlugin } = usePluginManagerContext();
	const [activeStep, setActiveStep] = useState(1);
	const [downloadProgress, setDownloadProgress] = useState<any>({ totalBytes: 0 });
	const [savedPath, setSavedPath] = useState<string>();

	const handleDownload = useCallback(async () => {
		setActiveStep(2);
		try {
			const savedPath = await downloadPlugin(plugin.id, repositoryURL);
			setSavedPath(savedPath);
			setTimeout(() => setActiveStep(3), 500); // Animation delay
		} catch (e) {
			toasts.error(t("PLUGINS.MODAL_INSTALL_PLUGIN.DOWNLOAD_FAILURE", { name: plugin.title }));
			onClose?.();
		}
	}, [downloadPlugin, plugin, onClose, repositoryURL, t]);

	const handleInstall = useCallback(async () => {
		try {
			await installPlugin(savedPath, plugin.id);
			toasts.success(t("PLUGINS.MODAL_INSTALL_PLUGIN.SUCCESS", { name: plugin.title }));
		} catch {
			/* istanbul ignore next */
			toasts.error(t("PLUGINS.MODAL_INSTALL_PLUGIN.INSTALL_FAILURE", { name: plugin.title }));
		} finally {
			onClose?.();
		}
	}, [installPlugin, plugin, onClose, savedPath, t]);

	useEffect(() => {
		// @ts-ignore
		const listener = (_, value: any) => setDownloadProgress(value);
		ipcRenderer.on("plugin:download-progress", listener);

		return () => {
			ipcRenderer.removeListener("plugin:download-progress", listener);
		};
	}, []);

	return (
		<Modal
			title={t(activeStep === 1 ? "COMMON.ATTENTION" : "COMMON.DOWNLOADING")}
			size="lg"
			isOpen={isOpen}
			onClose={onClose}
		>
			<Tabs activeId={activeStep}>
				<TabPanel tabId={1}>
					<FirstStep plugin={plugin} />
				</TabPanel>

				<TabPanel tabId={2}>
					<SecondStep plugin={plugin} downloadProgress={downloadProgress} />
				</TabPanel>

				<TabPanel tabId={3}>
					<ThirdStep plugin={plugin} />
				</TabPanel>

				<div className="flex justify-end mt-8 space-x-3">
					{activeStep === 1 && (
						<>
							<Button variant="secondary" onClick={onCancel} data-testid="InstallPlugin__cancel-button">
								{t("COMMON.CANCEL")}
							</Button>
							<Button onClick={handleDownload} data-testid="InstallPlugin__download-button">
								{t("COMMON.DOWNLOAD")}
							</Button>
						</>
					)}

					{activeStep === 3 && (
						<>
							<Button variant="secondary" onClick={onCancel} data-testid="InstallPlugin__cancel-button">
								{t("COMMON.CANCEL")}
							</Button>

							<Button onClick={handleInstall} data-testid="InstallPlugin__install-button">
								{t("COMMON.INSTALL")}
							</Button>
						</>
					)}
				</div>
			</Tabs>
		</Modal>
	);
};

InstallPlugin.defaultProps = {
	isOpen: false,
};
