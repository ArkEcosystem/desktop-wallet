import { ipcRenderer } from "electron";
import { useCallback, useEffect, useState } from "react";

import { useNotifications } from "./use-notifications";

export type DownloadProgress = {
	total: number;
	percent: number;
	transferred: number;
};

type DownloadStatus = "idle" | "started" | "completed" | "canceled" | "errored";

enum IpcEvent {
	QUIT_INSTALL = `updater:quit-and-install`,
	CANCEL = `updater:cancel`,
	CHECK_UPDATES = `updater:check-for-updates`,
	DOWNLOAD_UPDATE = `updater:download-update`,
	DOWNLOAD_PROGRESS = `updater:download-progress`,
	UPDATE_DOWNLOADED = `updater:update-downloaded`,
	ERROR = `updater:error`,
}

const downloadProgressDefaults = () => ({
	total: 0,
	percent: 0,
	transferred: 0,
});

export const useUpdater = () => {
	const [downloadProgress, setDownloadProgress] = useState<DownloadProgress>(downloadProgressDefaults());
	const [downloadStatus, setDownloadStatus] = useState<DownloadStatus>("idle");
	const [updateVersion, setUpdateVersion] = useState<string>();

	const { notifications } = useNotifications();

	const downloadUpdate = () => {
		setDownloadStatus("started");
		ipcRenderer.invoke(IpcEvent.DOWNLOAD_UPDATE);
	};

	const cancel = () => {
		setDownloadStatus("canceled");
		setDownloadProgress(downloadProgressDefaults());
		ipcRenderer.invoke(IpcEvent.CANCEL);
	};

	const quitInstall = () => {
		setDownloadStatus("idle");
		ipcRenderer.invoke(IpcEvent.QUIT_INSTALL);
		notifications.deleteNotificationsByVersion({ version: updateVersion });
	};

	const notifyForUpdates: any = useCallback(async () => {
		try {
			const { cancellationToken, updateInfo } = await ipcRenderer.invoke(IpcEvent.CHECK_UPDATES);
			const hasNewerVersion = !!cancellationToken;

			if (!hasNewerVersion) {
				return;
			}

			setUpdateVersion(updateInfo.version);
			notifications.notifyWalletUpdate({ version: updateInfo.version });
		} catch (error) {
			console.log(`Checking for update failed: ${error.message}`);
		}
	}, [notifications]);

	useEffect((): any => {
		const updateDownloaded = () => {
			setDownloadStatus("completed");
			setDownloadProgress(downloadProgressDefaults());
		};

		const updateDownloadProgress = (_: any, { total, percent, transferred }: any) => {
			setDownloadProgress({ total, percent, transferred });
		};

		ipcRenderer.on(IpcEvent.UPDATE_DOWNLOADED, updateDownloaded);
		ipcRenderer.on(IpcEvent.DOWNLOAD_PROGRESS, updateDownloadProgress);

		return () => {
			ipcRenderer.removeListener(IpcEvent.DOWNLOAD_PROGRESS, updateDownloaded);
			ipcRenderer.removeListener(IpcEvent.DOWNLOAD_PROGRESS, updateDownloadProgress);
		};
	}, []);

	return {
		cancel,
		notifyForUpdates,
		downloadUpdate,
		quitInstall,
		downloadProgress,
		downloadStatus,
	};
};
