import { ipcRenderer } from "electron";

const ipcEvents = (prefix = "updater") => ({
	QUIT_INSTALL: `${prefix}:quit-and-install`,
	CANCEL: `${prefix}:cancel`,
	CHECK_UPDATES: `${prefix}:check-for-updates`,
	DOWNLOAD_UPDATE: `${prefix}:download-update`,
});

export const useUpdater = () => {
	const { CANCEL, QUIT_INSTALL, CHECK_UPDATES, DOWNLOAD_UPDATE } = ipcEvents();

	const cancel = () => {
		ipcRenderer.send(CANCEL);
	};

	const checkForUpdates = () => {
		ipcRenderer.send(CHECK_UPDATES);
	};

	const quitInstall = () => {
		ipcRenderer.send(QUIT_INSTALL);
	};

	const downloadUpdate = () => {
		ipcRenderer.send(DOWNLOAD_UPDATE);
	};

	return {
		cancel,
		checkForUpdates,
		downloadUpdate,
		quitInstall,
	};
};
